import crypto from "crypto";
import bcrypt from "bcryptjs";
import { authRepository } from "../repositories/auth.repository.js";
import { BaseService } from "./base.service.js";
import { emailService } from "../utils/sendEmail.js";
import { generateToken, generateEmailVerificationToken, verifyEmailVerificationToken } from "../utils/token.js";
import { resolvePreviewUrl } from "../utils/mediaUrl.js";

const SALT_ROUNDS = 10;

const withPasswordSelect = {
  id: true,
  uuid: true,
  name: true,
  email: true,
  email_verified: true,
  email_verified_at: true,
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

const getFrontendBaseUrl = (role) => {
  if (role === "admin" || role === "super_admin") {
    return process.env.FRONTEND_ADMIN_URL || process.env.CLIENT_ORIGIN || "http://localhost:3000";
  }
  return process.env.FRONTEND_USER_URL || process.env.CLIENT_ORIGIN || "http://localhost:3000";
};

const sendVerificationEmail = async (user) => {
  const token = generateEmailVerificationToken(user);
  const frontendBaseUrl = getFrontendBaseUrl(user.role);
  const verificationUrl = `${frontendBaseUrl}/verify-email?token=${encodeURIComponent(token)}`;
  const expiryTime = process.env.EMAIL_VERIFICATION_EXPIRES_IN || "24 hours";

  await emailService.send("verification", {
    to: user.email,
    subject: `Verify your email - ${process.env.APP_NAME || "NACK"}`,
    templateVars: {
      name: user.name,
      verificationUrl,
      expiryTime,
    },
  });
};

export const authService = {
  async register(body) {
    const { name, email, password, role } = body || {};

    const existingUser = await authRepository.findUserByEmail(email);
    if (existingUser) {
      BaseService.throwError(409, "auth.register.user_exists");
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = await authRepository.createUser({
      name,
      email,
      password: hashedPassword,
      role,
      email_verified: "N",
      email_verified_at: null,
    });

    await emailService.send("welcome", {
      to: newUser.email,
      subject: `Welcome to ${process.env.APP_NAME || "NACK"}`,
      templateVars: { name: newUser.name },
    });

    await sendVerificationEmail(newUser);

    return {
      user: {
        id: newUser.id,
        uuid: newUser.uuid,
        name: newUser.name,
        email: newUser.email,
        email_verified: newUser.email_verified,
        role: newUser.role,
        avatar: resolvePreviewUrl(newUser.avatar),
      },
      verification_sent: true,
    };
  },

  async login(body) {
    const { email, password } = body || {};

    const user = await authRepository.findUserByEmail(email, withPasswordSelect);
    if (!user) {
      BaseService.throwError(404, "auth.login.user_not_found");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      BaseService.throwError(401, "auth.login.incorrect_credentials");
    }

    if (user.status === "inactive") {
      BaseService.throwError(401, "auth.login.account_inactive");
    }

    if (user.email_verified !== "Y") {
      BaseService.throwError(401, "auth.login.email_not_verified");
    }

    const token = generateToken(user);
    return {
      token,
      user: {
        id: user.id,
        uuid: user.uuid,
        name: user.name,
        email: user.email,
        email_verified: user.email_verified,
        avatar: resolvePreviewUrl(user.avatar),
        role: user.role,
      },
    };
  },

  async forgotPassword(body) {
    const { email } = body || {};

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

    const base_url = user.role === "admin" ? process.env.FRONTEND_ADMIN_URL : process.env.FRONTEND_USER_URL;
    const reset_url = `${base_url}/reset-password/${resetToken}`;

    await emailService.send("forgotPassword", {
      to: user.email,
      subject: `Hello ${user.name}, reset your password`,
      templateVars: { name: user.name, reset_url },
    });
  },

  async resetPassword(token, body) {
    const { password } = body || {};

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

  async sendEmailVerification(body) {
    const { email } = body || {};

    const user = await authRepository.findUserByEmail(email, withPasswordSelect);
    if (!user) {
      BaseService.throwError(404, "auth.login.user_not_found");
    }

    if (user.email_verified === "Y") {
      BaseService.throwError(400, "auth.verify_email.already_verified");
    }

    await sendVerificationEmail(user);
    return { verification_sent: true };
  },

  async verifyEmail(token) {
    const decoded = verifyEmailVerificationToken(token);
    if (!decoded?.id) {
      BaseService.throwError(400, "auth.verify_email.invalid_or_expired");
    }

    const user = await authRepository.findUserById(Number(decoded.id), withPasswordSelect);
    if (!user || user.email !== decoded.email) {
      BaseService.throwError(400, "auth.verify_email.invalid_or_expired");
    }

    if (user.email_verified === "Y") {
      return { already_verified: true };
    }

    await authRepository.updateUserById(user.id, {
      email_verified: "Y",
      email_verified_at: new Date(),
    });

    return { verified: true };
  },

  logout(user) {
    return { role: user?.role };
  },
};
