import { sendResponse, handleError } from "../utils/response.js";
import { listService } from "../services/list.service.js";

/**
 * @desc List board lists with pagination/search
 * @route GET /list/list
 * @access Authenticated
 */
export const listLists = async (req, res) => {
  try {
    const data = await listService.listLists(req.query);
    return sendResponse(res, 200, true, "list.list.success", data);
  } catch (error) {
    return handleError(req, res, error, { logPrefix: "List Fetch Error:" });
  }
};

/**
 * @desc Create a new list
 * @route POST /list/create
 * @access Authenticated
 */
export const createList = async (req, res) => {
  try {
    const list = await listService.createList(req.body);
    return sendResponse(res, 201, true, "list.create.success", { list });
  } catch (error) {
    return handleError(req, res, error, { logPrefix: "List Create Error:" });
  }
};

/**
 * @desc Get list details by UUID
 * @route GET /list/get/:uuid
 * @access Authenticated
 */
export const getList = async (req, res) => {
  try {
    const list = await listService.getList(req.params.uuid);
    return sendResponse(res, 200, true, "list.get.success", { list });
  } catch (error) {
    return handleError(req, res, error, { logPrefix: "Get List Error:" });
  }
};

/**
 * @desc Update list by UUID
 * @route PUT /list/update/:uuid
 * @access Authenticated
 */
export const updateList = async (req, res) => {
  try {
    const list = await listService.updateList(req.params.uuid, req.body);
    return sendResponse(res, 200, true, "list.update.success", { list });
  } catch (error) {
    return handleError(req, res, error, { logPrefix: "List Update Error:" });
  }
};

/**
 * @desc Delete list by UUID
 * @route DELETE /list/delete/:uuid
 * @access Authenticated
 */
export const deleteList = async (req, res) => {
  try {
    await listService.deleteList(req.params.uuid);
    return sendResponse(res, 200, true, "list.delete.success");
  } catch (error) {
    return handleError(req, res, error, { logPrefix: "List Delete Error:" });
  }
};


