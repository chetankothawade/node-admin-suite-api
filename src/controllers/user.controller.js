import { Parser } from "json2csv";
import { sendResponse, handleError } from "../utils/response.js";
import { UserService, userCsvFields } from "../services/user.service.js";
import { UserRepository } from "../repositories/user.repository.js";

const userService = new UserService(new UserRepository());

const DANGEROUS_CSV_PREFIX = /^[=+\-@]/;

const sanitizeCsvCell = (value) => {
  if (typeof value !== "string") return value;
  return DANGEROUS_CSV_PREFIX.test(value) ? `'${value}` : value;
};

/**
 * @desc Create a new user
 * @route POST /user/create
 * @access Authenticated
 */
export const createUser = async (req, res) => {
  try {
    const user = await userService.createUser({ body: req.body, file: req.file, req });
    return sendResponse(res, 201, true, "user.create.success", { user });
  } catch (error) {
    return handleError(req, res, error, { logPrefix: "Create user error:" });
  }
};

/**
 * @desc List users
 * @route GET /user/list
 * @access Authenticated
 */
export const listUser = async (req, res) => {
  try {
    const data = await userService.getUsers({
      current_user_id: req.user?.id || 0,
      query: req.query,
    });

    return sendResponse(res, 200, true, "user.list.success", data);
  } catch (error) {
    return handleError(req, res, error, { logPrefix: "List user error:" });
  }
};

/**
 * @desc Get user by UUID
 * @route GET /user/get/:uuid
 * @access Authenticated
 */
export const getUser = async (req, res) => {
  try {
    const user = await userService.getUserByUuid(req.params.uuid);
    return sendResponse(res, 200, true, "user.getMe.success", { user });
  } catch (error) {
    return handleError(req, res, error, { logPrefix: "Get user error:" });
  }
};

/**
 * @desc Update user by UUID
 * @route PUT /user/update/:uuid
 * @access Authenticated
 */
export const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUserByUuid({
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

/**
 * @desc Delete user by UUID (soft delete)
 * @route PATCH /user/delete/:uuid
 * @access Authenticated
 */
export const deleteUser = async (req, res) => {
  try {
    await userService.deleteUserByUuid(req.params.uuid);
    return sendResponse(res, 200, true, "user.delete.success");
  } catch (error) {
    return handleError(req, res, error, { logPrefix: "Delete user error:" });
  }
};

/**
 * @desc Toggle user status by UUID
 * @route PUT /user/status/:uuid
 * @access Authenticated
 */
export const userStatus = async (req, res) => {
  try {
    const user = await userService.updateUserStatusByUuid(req.params.uuid, req.body);
    return sendResponse(res, 200, true, "user.status.success", { user });
  } catch (error) {
    return handleError(req, res, error, { logPrefix: "User status error:" });
  }
};

/**
 * @desc Get current authenticated user
 * @route GET /user/me
 * @access Authenticated
 */
export const getMe = async (req, res) => {
  try {
    const user = await userService.getMe(req.user.id);
    return sendResponse(res, 200, true, "user.getMe.success", { user });
  } catch (error) {
    return handleError(req, res, error, { logPrefix: "Get me error:" });
  }
};

/**
 * @desc Get admin users list
 * @route GET /user/getList
 * @access Authenticated
 */
export const getUserList = async (req, res) => {
  try {
    const users = await userService.getAdminUsers();
    return sendResponse(res, 200, true, "user.list.success", { users });
  } catch (error) {
    return handleError(req, res, error, { logPrefix: "Get user list error:" });
  }
};

/**
 * @desc Export users as CSV
 * @route GET /user/export/csv
 * @access Authenticated
 */
export const exportUsersCSV = async (req, res) => {
  try {
    const userData = await userService.getUsersForCsv();
    const sanitizedData = userData.map((row) =>
      Object.fromEntries(
        Object.entries(row).map(([key, value]) => [key, sanitizeCsvCell(value)])
      )
    );
    const parser = new Parser({ fields: userCsvFields });
    const csv = parser.parse(sanitizedData);

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
