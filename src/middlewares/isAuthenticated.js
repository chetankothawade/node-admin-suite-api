// middleware/isAuthenticated.js
import { verifyToken } from "../utils/token.js";
import logger from "../utils/logger.js";

const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided, authorization denied",
      });
    }

    const token = authHeader.split(" ")[1];

    // Try to verify with user secret first
    let decoded = verifyToken(token);

    // If not valid, try admin secret
    if (!decoded) {
      decoded = verifyToken(token, "admin");
    }

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // Attach user info to request
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    logger.error({ err: error }, "Auth middleware error");
    return res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
    });
  }
};

export default isAuthenticated;


