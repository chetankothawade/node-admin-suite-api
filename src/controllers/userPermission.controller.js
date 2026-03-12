import { sendResponse, handleError } from "../utils/response.js";
import { userPermissionService } from "../services/userPermission.service.js";

/**
 * Toggle user permission
 * POST /user-permissions/toggle
 */
export const toggleUserPermission = async (req, res) => {
  try {
    const { user_id, module_permission_id, isChecked } = req.body;
    const data = await userPermissionService.toggle(user_id, module_permission_id, isChecked);

    return sendResponse(res, 200, true, "user_permission.update.success", data);
  } catch (error) {
    return handleError(req, res, error, {
      logPrefix: "Toggle permission error:",
    });
  }
};


/**
 * Get module permission matrix
 * GET /user-permissions/getAll/:uuid
 */
export const getUsersModulesPermission = async (req, res) => {
  try {
    const data = await userPermissionService.getUsersModulesPermission(req.params.uuid);

    return sendResponse(res, 200, true, "user_permission.matrix.success", data);
  } catch (error) {
    return handleError(req, res, error, {
      logPrefix: "Get permission matrix error:",
    });
  }
};


/**
 * Get user module access
 * GET /user-permissions/module-access/:uuid
 */
export const userModuleAccess = async (req, res) => {
  try {
    const data = await userPermissionService.getUserModuleAccess(req.params.uuid);

    return sendResponse(res, 200, true, "user_permission.module_access.success", data);
  } catch (error) {
    return handleError(req, res, error, {
      logPrefix: "User module access error:",
    });
  }
};


/**
 * Sidebar menu
 */
export const sidebarMenu = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return sendResponse(res, 401, false, "auth.unauthorized");
    }

    const menu = await userPermissionService.buildSidebarMenu(userId);

    return sendResponse(res, 200, true, "user_permission.sidebar.success", menu);
  } catch (error) {
    return handleError(req, res, error, {
      logPrefix: "Sidebar error:",
    });
  }
};
