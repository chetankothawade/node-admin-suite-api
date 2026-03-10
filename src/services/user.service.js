import bcrypt from "bcryptjs";
import { BaseService } from "./base.service.js";
import { getPaginationParams, buildPaginationMeta } from "./pagination.service.js";
import { userRepository } from "../repositories/user.repository.js";
import fs from "fs";
import path from "path";

const SALT_ROUNDS = 10;

const USER_LIST_ATTRIBUTES = ["id", "uuid", "name", "email", "phone", "avatar", "role", "status", "createdAt"];
const USER_DETAIL_ATTRIBUTES = ["id", "uuid", "name", "email", "phone", "avatar", "role", "createdAt", "status"];
const USER_ME_ATTRIBUTES = ["id", "uuid", "name", "email", "phone", "avatar", "role", "createdAt"];
const USER_CSV_ATTRIBUTES = ["id", "uuid", "name", "email", "phone", "role", "status", "createdAt"];

export const userCsvFields = [
  { label: "User ID", value: "id" },
  { label: "User UUID", value: "uuid" },
  { label: "Name", value: "name" },
  { label: "Email", value: "email" },
  { label: "Phone", value: "phone" },
  { label: "Role", value: "role" },
  { label: "Status", value: "status" },
  { label: "Created Date", value: (row) => new Date(row.createdAt).toLocaleString() },
];

const hasRequiredFields = (payload, fields) => fields.every((field) => Boolean(payload[field]));
const validateCreateUserPayload = (payload) =>
  hasRequiredFields(payload, ["name", "email", "phone", "role", "password"]);
const validateUpdateUserPayload = (payload) =>
  hasRequiredFields(payload, ["name", "email", "phone", "role"]);
const validateStatusPayload = (payload) => Boolean(payload?.status);

const buildAvatarUrl = (req, filename) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  return `${baseUrl}/uploads/images/${filename}`;
};

const removeAvatarFromDisk = (avatarUrl) => {
  if (!avatarUrl) return;
  // Avatar is stored as full URL; keep only filename for local filesystem delete.
  const oldFile = path.join("uploads", path.basename(avatarUrl));
  if (fs.existsSync(oldFile)) {
    fs.unlinkSync(oldFile);
  }
};

const buildUserListWhereClause = ({ currentUserId, search = "" }) => ({
  // Exclude suspended users and current logged-in user from admin list endpoint.
  status: { not: "suspended" },
  id: { not: currentUserId },
  ...(search && {
    OR: [
      { name: { contains: search } },
      { email: { contains: search } },
      { phone: { contains: search } },
    ],
  }),
});

export const userService = {
  async listUsers({ currentUserId, query }) {
    const { page, limit, offset, sortedField, sortedBy } = getPaginationParams(query);
    const search = query.search || "";
    const where = buildUserListWhereClause({ currentUserId, search });

    const { count, rows } = await userRepository.listUsers({
      where,
      attributes: USER_LIST_ATTRIBUTES,
      limit,
      offset,
      order: [[sortedField, sortedBy]],
    });

    return {
      users: rows || [],
      pagination: buildPaginationMeta(count || 0, page, limit),
    };
  },

  async createUser({ body, file, req }) {
    if (!validateCreateUserPayload(body)) {
      BaseService.throwError(400, "validation.missing_fields");
    }

    const existingUser = await userRepository.findByEmail(body.email);
    if (existingUser) {
      BaseService.throwError(409, "auth.register.user_exists");
    }

    const avatar = file ? buildAvatarUrl(req, file.filename) : "";
    const hashedPassword = await bcrypt.hash(body.password, SALT_ROUNDS);

    return userRepository.create({
      name: body.name,
      email: body.email,
      phone: body.phone,
      avatar,
      role: body.role,
      password: hashedPassword,
    });
  },

  async updateUser({ uuid, body, file, req }) {
    if (!validateUpdateUserPayload(body)) {
      BaseService.throwError(400, "validation.missing_fields");
    }

    const user = await userRepository.findByUuid(uuid);
    if (!user) {
      BaseService.throwError(404, "error.not_found");
    }

    const emailTaken = await userRepository.findByEmailExcludingId(body.email, user.id);
    if (emailTaken) {
      BaseService.throwError(409, "validation.email_already_exists");
    }

    if (file) {
      // Replace avatar atomically: delete old file only when a new one arrives.
      removeAvatarFromDisk(user.avatar);
    }
    const avatar = file ? buildAvatarUrl(req, file.filename) : user.avatar;

    return userRepository.model.update({
      where: { id: user.id },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        role: body.role,
        avatar,
      },
    });
  },

  async deleteUser(uuid) {
    const user = await userRepository.findByUuid(uuid);
    if (!user) {
      BaseService.throwError(404, "error.not_found");
    }

    // Soft-delete strategy:
    // keep row for audit/history, prevent login/listing via suspended status.
    await userRepository.model.update({
      where: { id: user.id },
      data: {
        status: "suspended",
        // Prefix email so unique constraint does not block future re-registration.
        email: `deleted_${user.email}`,
      },
    });
  },

  async getUser(uuid) {
    const user = await userRepository.findByUuid(uuid, USER_DETAIL_ATTRIBUTES);
    if (!user) {
      BaseService.throwError(404, "error.not_found");
    }
    return user;
  },

  async updateUserStatus(uuid, payload) {
    if (!validateStatusPayload(payload)) {
      BaseService.throwError(400, "validation.missing_fields");
    }

    const user = await userRepository.findByUuid(uuid);
    if (!user) {
      BaseService.throwError(404, "error.not_found");
    }

    // Existing UI toggles status using provided value as current state.
    return userRepository.model.update({
      where: { id: user.id },
      data: { status: payload.status === "active" ? "inactive" : "active" },
    });
  },

  async getMe(userId) {
    const user = await userRepository.findByPk(userId, { attributes: USER_ME_ATTRIBUTES });
    if (!user) {
      BaseService.throwError(404, "error.not_found");
    }
    return user;
  },

  getAdminUsers() {
    return userRepository.listAdmins(USER_LIST_ATTRIBUTES);
  },

  async getUsersForCsv() {
    const users = await userRepository.listForCsv(USER_CSV_ATTRIBUTES);
    if (!users || users.length === 0) {
      BaseService.throwError(404, "No users found to export.");
    }
    return users;
  },
};
