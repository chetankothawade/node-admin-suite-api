import bcrypt from "bcryptjs";
import { BaseService } from "./base.service.js";
import { getPaginationParams, buildPaginationMeta } from "./pagination.service.js";
import { Storage } from "./storage/storageManager.js";

const SALT_ROUNDS = 10;

const USER_LIST_FIELDS = ["id", "uuid", "name", "email", "phone", "avatar", "role", "status", "created_at"];
const USER_DETAIL_FIELDS = ["id", "uuid", "name", "email", "phone", "avatar", "role", "status", "created_at"];
const USER_ME_FIELDS = ["id", "uuid", "name", "email", "phone", "avatar", "role", "created_at"];

export const userCsvFields = [
  { label: "User ID", value: "id" },
  { label: "User UUID", value: "uuid" },
  { label: "Name", value: "name" },
  { label: "Email", value: "email" },
  { label: "Phone", value: "phone" },
  { label: "Role", value: "role" },
  { label: "Status", value: "status" },
  { label: "Created Date", value: (row) => new Date(row.created_at).toLocaleString() },
];

export class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  buildAbsoluteUrl(req, url) {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
  }

  extractStoragePath(avatarUrl = "") {
    if (!avatarUrl) return "";
    try {
      const parsed = new URL(avatarUrl);
      return parsed.pathname.replace(/^\/+/, "");
    } catch {
      return avatarUrl.replace(/^\/+/, "");
    }
  }

  async removeAvatarFromStorage(avatarUrl) {
    if (!avatarUrl) return;

    const oldFilePath = this.extractStoragePath(avatarUrl);
    if (!oldFilePath) return;

    const exists = await Storage.exists(oldFilePath);
    if (exists) {
      await Storage.delete(oldFilePath);
    }
  }

  validateCreatePayload(body = {}) {
    const required = ["name", "email", "phone", "role", "password"];
    return required.every((field) => Boolean(body[field]));
  }

  validateUpdatePayload(body = {}) {
    const required = ["name", "email", "phone", "role"];
    return required.every((field) => Boolean(body[field]));
  }

  async createUser({ body, file, req }) {
    if (!this.validateCreatePayload(body)) {
      BaseService.throwError(400, "validation.missing_fields");
    }

    const existingUser = await this.userRepository.getUserByEmail(body.email);
    if (existingUser) {
      BaseService.throwError(409, "auth.register.user_exists");
    }

    const avatarUpload = file ? await Storage.put(file, "images") : null;
    const avatar = avatarUpload ? this.buildAbsoluteUrl(req, avatarUpload.url) : "";
    const password = await bcrypt.hash(body.password, SALT_ROUNDS);

    return this.userRepository.createUser(
      {
        name: body.name,
        email: body.email,
        phone: body.phone,
        avatar,
        role: body.role,
        password,
      },
      USER_DETAIL_FIELDS
    );
  }

  async getUsers({ current_user_id, query }) {
    const { page, limit, sorted_field, sorted_by } = getPaginationParams(query);
    const search = query.search || "";

    const where = {
      id: { not: current_user_id },
      status: { not: "suspended" },
      ...(search
        ? {
            OR: [
              { name: { contains: search } },
              { email: { contains: search } },
              { phone: { contains: search } },
            ],
          }
        : {}),
    };

    const { total, users } = await this.userRepository.getUsers({
      where,
      page,
      limit,
      orderBy: { [sorted_field]: sorted_by.toLowerCase() },
      fields: USER_LIST_FIELDS,
    });

    return {
      users,
      pagination: buildPaginationMeta(total, page, limit),
    };
  }

  async getUserById(id) {
    const user = await this.userRepository.getUserById(id, USER_DETAIL_FIELDS);
    if (!user) {
      BaseService.throwError(404, "error.not_found");
    }
    return user;
  }

  async updateUser({ id, body, file, req }) {
    if (!this.validateUpdatePayload(body)) {
      BaseService.throwError(400, "validation.missing_fields");
    }

    const user = await this.userRepository.getUserById(id);
    if (!user) {
      BaseService.throwError(404, "error.not_found");
    }

    const emailTaken = await this.userRepository.getUserByEmailExcludingId(body.email, id);
    if (emailTaken) {
      BaseService.throwError(409, "validation.email_already_exists");
    }

    let avatar = user.avatar;
    if (file) {
      await this.removeAvatarFromStorage(user.avatar);
      const avatarUpload = await Storage.put(file, "images");
      avatar = this.buildAbsoluteUrl(req, avatarUpload.url);
    }

    return this.userRepository.updateUser(
      id,
      {
        name: body.name,
        email: body.email,
        phone: body.phone,
        role: body.role,
        avatar,
      },
      USER_DETAIL_FIELDS
    );
  }

  async deleteUser(id) {
    const user = await this.userRepository.getUserById(id);
    if (!user) {
      BaseService.throwError(404, "error.not_found");
    }

    // Keep historical records; this app uses soft delete semantics.
    await this.userRepository.updateUser(id, {
      status: "suspended",
      email: `deleted_${user.email}`,
    });
  }

  async getUserByUuid(uuid) {
    const user = await this.userRepository.getUserByUuid(uuid, USER_DETAIL_FIELDS);
    if (!user) {
      BaseService.throwError(404, "error.not_found");
    }
    return user;
  }

  async updateUserByUuid({ uuid, body, file, req }) {
    const user = await this.userRepository.getUserByUuid(uuid);
    if (!user) {
      BaseService.throwError(404, "error.not_found");
    }

    return this.updateUser({ id: user.id, body, file, req });
  }

  async deleteUserByUuid(uuid) {
    const user = await this.userRepository.getUserByUuid(uuid);
    if (!user) {
      BaseService.throwError(404, "error.not_found");
    }

    await this.deleteUser(user.id);
  }

  async updateUserStatusByUuid(uuid, payload = {}) {
    if (!payload.status) {
      BaseService.throwError(400, "validation.missing_fields");
    }

    const user = await this.userRepository.getUserByUuid(uuid);
    if (!user) {
      BaseService.throwError(404, "error.not_found");
    }

    return this.userRepository.updateUser(
      user.id,
      { status: payload.status === "active" ? "inactive" : "active" },
      USER_DETAIL_FIELDS
    );
  }

  async getMe(user_id) {
    const user = await this.userRepository.getUserById(user_id, USER_ME_FIELDS);
    if (!user) {
      BaseService.throwError(404, "error.not_found");
    }

    return user;
  }

  async getAdminUsers() {
    return this.userRepository.listAdmins(USER_LIST_FIELDS);
  }

  async getUsersForCsv() {
    const users = await this.userRepository.listForCsv(USER_LIST_FIELDS);
    if (!users || users.length === 0) {
      BaseService.throwError(404, "No users found to export.");
    }

    return users;
  }
}
