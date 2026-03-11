import crypto from "crypto";
import bcrypt from "bcryptjs";
import { authRepository } from "../repositories/auth.repository.js";
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
  reset_password_token: true,
  reset_password_expire: true,
  created_at: true,
  updated_at: true,
};

export const authService = {
  async register(body) {
    const { name, email, password, role } = body || {};
    if (!name || !email || !password || !role) {
      BaseService.throwError(400, "auth.register.fields_required");
    }

    const existingUser = await authRepository.findUserByEmail(email);
    if (existingUser) {
      BaseService.throwError(409, "auth.register.user_exists");
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = await authRepository.createUser({ name, email, password: hashedPassword, role });
    const token = generateToken(newUser);

    return {
      token,
      user: {
        id: newUser.id,
        uuid: newUser.uuid,
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

    const user = await authRepository.findUserByEmail(email, withPasswordSelect);
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
        uuid: user.uuid,
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

    const user = await authRepository.findUserByEmail(email);
    if (!user) {
      BaseService.throwError(404, "auth.forgot_password.user_not_found");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

    await authRepository.updateUserById(user.id, {
      reset_password_token: resetTokenHash,
      reset_password_expire: new Date(Date.now() + 15 * 60 * 1000),
    });

    const base_url =
      user.role === "admin" ? process.env.FRONTEND_ADMIN_URL : process.env.FRONTEND_USER_URL;
    const reset_url = `${base_url}/reset-password/${resetToken}`;

    await emailService.send("forgotPassword", {
      to: user.email,
      subject: `Hello ${user.name}, reset your password`,
      templateVars: { name: user.name, reset_url },
    });
  },

  async resetPassword(token, body) {
    const { password } = body || {};
    if (!password) {
      BaseService.throwError(400, "auth.reset_password.password_required");
    }

    const resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const user = await authRepository.findResettableUser(resetTokenHash, new Date(), withPasswordSelect);

    if (!user) {
      BaseService.throwError(400, "auth.reset_password.invalid_or_expired");
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    await authRepository.updateUserById(user.id, {
      password: hashedPassword,
      reset_password_token: null,
      reset_password_expire: null,
    });
  },

  logout(user) {
    return { role: user?.role };
  },
};


