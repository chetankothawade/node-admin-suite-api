// controllers/user.controller.js
import { Parser } from "json2csv";
import { sendResponse, handleError } from "../utils/response.js";
import { UserService, userCsvFields } from "../services/user.service.js";
import { UserRepository } from "../repositories/user.repository.js";

class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  createUser = async (req, res) => {
    try {
      if (!req.body?.name || !req.body?.email || !req.body?.phone || !req.body?.role || !req.body?.password) {
        return sendResponse(res, 400, false, "validation.missing_fields");
      }

      const user = await this.userService.createUser({ body: req.body, file: req.file, req });
      return sendResponse(res, 201, true, "user.create.success", { user });
    } catch (error) {
      return handleError(req, res, error, { logPrefix: "Create user error:" });
    }
  };

  getUsers = async (req, res) => {
    try {
      const data = await this.userService.getUsers({
        current_user_id: req.user?.id || 0,
        query: req.query,
      });
      return sendResponse(res, 200, true, "user.list.success", data);
    } catch (error) {
      return handleError(req, res, error, { logPrefix: "List user error:" });
    }
  };

  getUserById = async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        return sendResponse(res, 400, false, "validation.invalid_id");
      }

      const user = await this.userService.getUserById(id);
      return sendResponse(res, 200, true, "user.get.success", { user });
    } catch (error) {
      return handleError(req, res, error, { logPrefix: "Get user by id error:" });
    }
  };

  updateUser = async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        return sendResponse(res, 400, false, "validation.invalid_id");
      }

      const user = await this.userService.updateUser({
        id,
        body: req.body,
        file: req.file,
        req,
      });

      return sendResponse(res, 200, true, "user.update.success", { user });
    } catch (error) {
      return handleError(req, res, error, { logPrefix: "Update user error:" });
    }
  };

  deleteUser = async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        return sendResponse(res, 400, false, "validation.invalid_id");
      }

      await this.userService.deleteUser(id);
      return sendResponse(res, 200, true, "user.delete.success");
    } catch (error) {
      return handleError(req, res, error, { logPrefix: "Delete user error:" });
    }
  };

  // Backward-compatible existing endpoints (uuid-based)
  getUser = async (req, res) => {
    try {
      const user = await this.userService.getUserByUuid(req.params.uuid);
      return sendResponse(res, 200, true, "user.getMe.success", { user });
    } catch (error) {
      return handleError(req, res, error, { logPrefix: "Get user error:" });
    }
  };

  updateUserByUuid = async (req, res) => {
    try {
      const user = await this.userService.updateUserByUuid({
        uuid: req.params.uuid,
        body: req.body,
        file: req.file,
        req,
      });
      return sendResponse(res, 200, true, "user.update.success", { user });
    } catch (error) {
      return handleError(req, res, error, { logPrefix: "Update user error:" });
    }
  };

  deleteUserByUuid = async (req, res) => {
    try {
      await this.userService.deleteUserByUuid(req.params.uuid);
      return sendResponse(res, 200, true, "user.delete.success");
    } catch (error) {
      return handleError(req, res, error, { logPrefix: "Delete user error:" });
    }
  };

  userStatus = async (req, res) => {
    try {
      const user = await this.userService.updateUserStatusByUuid(req.params.uuid, req.body);
      return sendResponse(res, 200, true, "user.status.success", { user });
    } catch (error) {
      return handleError(req, res, error, { logPrefix: "User status error:" });
    }
  };

  getMe = async (req, res) => {
    try {
      const user = await this.userService.getMe(req.user.id);
      return sendResponse(res, 200, true, "user.getMe.success", { user });
    } catch (error) {
      return handleError(req, res, error, { logPrefix: "Get me error:" });
    }
  };

  getUserList = async (req, res) => {
    try {
      const users = await this.userService.getAdminUsers();
      return sendResponse(res, 200, true, "user.list.success", { users });
    } catch (error) {
      return handleError(req, res, error, { logPrefix: "Get user list error:" });
    }
  };

  exportUsersCSV = async (req, res) => {
    try {
      const userData = await this.userService.getUsersForCsv();
      const parser = new Parser({ fields: userCsvFields });
      const csv = parser.parse(userData);

      res.header("Content-Type", "text/csv");
      res.attachment("users_export.csv");
      return res.send(csv);
    } catch (error) {
      if (error.status && error.exposeMessage) {
        return sendResponse(res, error.status, false, error.exposeMessage);
      }

      console.error("Export CSV error:", error);
      return sendResponse(res, 500, false, "Failed to export users.");
    }
  };
}

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
export const userController = new UserController(userService);

// Backward-compatible named exports used by routes
export const listUser = userController.getUsers;
export const createUser = userController.createUser;
export const updateUser = userController.updateUserByUuid;
export const deleteUser = userController.deleteUserByUuid;
export const getUser = userController.getUser;
export const userStatus = userController.userStatus;
export const getMe = userController.getMe;
export const getUserList = userController.getUserList;
export const exportUsersCSV = userController.exportUsersCSV;
