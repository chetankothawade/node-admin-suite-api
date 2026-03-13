import multer from "multer";
import logger from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.message || "File upload validation failed.",
    });
  }

  const isFileTypeValidationError =
    typeof err?.message === "string" &&
    err.message.startsWith("Only ") &&
    err.message.toLowerCase().includes("allowed");

  if (isFileTypeValidationError) {
    return res.status(422).json({
      success: false,
      message: err.message,
    });
  }

  logger.error({ err }, "Unhandled application error");
  return res.status(500).json({ error: "Internal server error" });
};

export default errorHandler;

