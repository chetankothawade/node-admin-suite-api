import { sendResponse } from "../utils/response.js";

export const authorizeRoles = (...allowedRoles) => {
  const normalized = new Set(
    allowedRoles
      .flat()
      .map((role) => String(role || "").trim().toLowerCase())
      .filter(Boolean)
  );

  return (req, res, next) => {
    const currentRole = String(req.user?.role || "").trim().toLowerCase();

    if (!currentRole || !normalized.has(currentRole)) {
      return sendResponse(res, 403, false, "error.not_allowed");
    }

    return next();
  };
};

export default authorizeRoles;
