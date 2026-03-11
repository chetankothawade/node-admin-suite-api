import { sendResponse, handleError } from "../utils/response.js";
import { roleModuleService } from "../services/roleModule.service.js";

/**
 * @desc Get Role-Module matrix
 * @route GET /role-modules/matrix
 */
export const roleModuleMatrix = async (req, res) => {
  try {
    const data = await roleModuleService.matrix();

    return sendResponse(res, 200, true, "Role module matrix loaded", data);
  } catch (error) {
    return handleError(req, res, error, {
      logPrefix: "Role module matrix error:",
    });
  }
};


/**
 * @desc Toggle role module access
 * @route POST /role-modules/toggle
 */
export const toggleRoleModule = async (req, res) => {
  try {
    await roleModuleService.toggle(req.body);

    return sendResponse(res, 200, true, "Role module updated", {
      success: true,
    });
  } catch (error) {
    return handleError(req, res, error, {
      logPrefix: "Toggle role module error:",
    });
  }
};