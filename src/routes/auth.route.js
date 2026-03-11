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


const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").put(resetPassword);
router.route("/send-email-verification").post(sendEmailVerification);
router.route("/verify-email/:token").get(verifyEmail);

export default router;

