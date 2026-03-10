import crypto from "crypto";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";
import { BaseService } from "./base.service.js";
import { emailService } from "../utils/sendEmail.js";
import { generateToken } from "../utils/token.js";

const SALT_ROUNDS = 10;

const withPasswordSelect = {
  id: true,
  uuid: true,
  name: true,
  email: true,
  password: true,
  phone: true,
  avatar: true,
  role: true,
  status: true,
  resetPasswordToken: true,
  resetPasswordExpire: true,
  createdAt: true,
  updatedAt: true,
};

export const authService = {
  async register(body) {
    const { name, email, password, role } = body || {};
    if (!name || !email || !password || !role) {
      BaseService.throwError(400, "auth.register.fields_required");
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      BaseService.throwError(409, "auth.register.user_exists");
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    });
    const token = generateToken(newUser);

    return {
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar || null,
      },
    };
  },

  async login(body) {
    const { email, password } = body || {};
    if (!email || !password) {
      BaseService.throwError(400, "auth.login.fields_required");
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: withPasswordSelect,
    });
    if (!user) {
      BaseService.throwError(404, "auth.login.user_not_found");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      BaseService.throwError(401, "auth.login.incorrect_credentials");
    }

    // Keep existing behavior, including typo compatibility from legacy code.
    if (user.staus === "inactive") {
      BaseService.throwError(401, "auth.login.account_inactive");
    }

    const token = generateToken(user);
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || null,
        role: user.role,
      },
    };
  },

  async forgotPassword(body) {
    const { email } = body || {};
    if (!email) {
      BaseService.throwError(400, "auth.forgot_password.email_required");
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      BaseService.throwError(404, "auth.forgot_password.user_not_found");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetTokenHash,
        resetPasswordExpire: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    const baseUrl =
      user.role === "admin" ? process.env.FRONTEND_ADMIN_URL : process.env.FRONTEND_USER_URL;
    const resetUrl = `${baseUrl}/reset-password/${resetToken}`;

    await emailService.send("forgotPassword", {
      to: user.email,
      subject: `Hello ${user.name}, reset your password`,
      templateVars: { name: user.name, resetUrl },
    });
  },

  async resetPassword(token, body) {
    const { password } = body || {};
    if (!password) {
      BaseService.throwError(400, "auth.reset_password.password_required");
    }

    const resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: resetTokenHash,
        resetPasswordExpire: { gt: new Date() },
      },
      select: withPasswordSelect,
    });

    if (!user) {
      BaseService.throwError(400, "auth.reset_password.invalid_or_expired");
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpire: null,
      },
    });
  },

  logout(user) {
    return { role: user?.role };
  },
};
