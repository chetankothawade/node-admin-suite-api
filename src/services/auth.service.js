import crypto from "crypto";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import db from "../models/index.js";
import { BaseService } from "./base.service.js";
import { emailService } from "../utils/sendEmail.js";
import { generateToken } from "../utils/token.js";

const { User } = db;

export const authService = {
  async register(body) {
    const { name, email, password, role } = body || {};
    if (!name || !email || !password || !role) {
      BaseService.throwError(400, "auth.register.fields_required");
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      BaseService.throwError(409, "auth.register.user_exists");
    }

    const newUser = await User.create({ name, email, password, role });
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

    const user = await User.scope("withPassword").findOne({ where: { email } });
    if (!user) {
      BaseService.throwError(404, "auth.login.user_not_found");
    }

    const isPasswordMatch = await user.comparePassword(password);
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

    const user = await User.findOne({ where: { email } });
    if (!user) {
      BaseService.throwError(404, "auth.forgot_password.user_not_found");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    await user.save();

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
    const user = await User.scope("withPassword").findOne({
      where: {
        resetPasswordToken: resetTokenHash,
        resetPasswordExpire: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      BaseService.throwError(400, "auth.reset_password.invalid_or_expired");
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();
  },

  logout(user) {
    return { role: user?.role };
  },
};
