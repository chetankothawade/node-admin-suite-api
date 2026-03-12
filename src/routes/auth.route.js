//routes/auth.route.js
import express from "express";
import {
  login,
  logout,
  register,
  forgotPassword,
  resetPassword,
  sendEmailVerification,
  verifyEmail,
} from "../controllers/auth.controller.js";
import { validateRequest } from "../middlewares/validateRequest.js";


const router = express.Router();

router.route("/register").post(validateRequest("auth.register"), register);
router.route("/login").post(validateRequest("auth.login"), login);
router.route("/logout").post(logout);
router.route("/forgot-password").post(validateRequest("auth.forgot_password"), forgotPassword);
router.route("/reset-password/:token").put(validateRequest("auth.reset_password"), resetPassword);
router.route("/send-email-verification").post(validateRequest("auth.send_email_verification"), sendEmailVerification);
router.route("/verify-email/:token").get(validateRequest("auth.verify_email"), verifyEmail);

export default router;

