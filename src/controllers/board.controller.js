import { sendResponse, handleError } from "../utils/response.js";
import { boardService } from "../services/board.service.js";

/**
 * @desc List boards with pagination and search filters
 * @route GET /board/list
 * @access Authenticated
 */
export const listBoards = async (req, res) => {
  try {
    const data = await boardService.listBoards(req.query);
    return sendResponse(res, 200, true, "board.list.success", data);
  } catch (error) {
    return handleError(req, res, error, { logPrefix: "List Boards Error:" });
  }
};

/**
 * @desc Create a new board
 * @route POST /board/create
 * @access Authenticated
 */
export const createBoard = async (req, res) => {
  try {
    const board = await boardService.createBoard(req.body, req.user);
    return sendResponse(res, 201, true, "board.create.success", { board });
  } catch (error) {
    return handleError(req, res, error, { logPrefix: "Board Create Error:" });
  }
};

/**
 * @desc Get a single board by UUID
 * @route GET /board/get/:uuid
 * @access Authenticated
 */
export const getBoard = async (req, res) => {
  try {
    const board = await boardService.getBoard(req.params.uuid);
    return sendResponse(res, 200, true, "board.get.success", { board });
  } catch (error) {
    return handleError(req, res, error, { logPrefix: "Board Get Error:" });
  }
};

/**
 * @desc Update board details by UUID
 * @route PUT /board/update/:uuid
 * @access Authenticated
 */
export const updateBoard = async (req, res) => {
  try {
    const board = await boardService.updateBoard(req.params.uuid, req.body);
    return sendResponse(res, 200, true, "board.update.success", { board });
  } catch (error) {
    return handleError(req, res, error, { logPrefix: "Board Update Error:" });
  }
};

/**
 * @desc Delete board by UUID
 * @route DELETE /board/delete/:uuid
 * @access Authenticated
 */
export const deleteBoard = async (req, res) => {
  try {
    await boardService.deleteBoard(req.params.uuid);
    return sendResponse(res, 200, true, "board.delete.success");
  } catch (error) {
    return handleError(req, res, error, { logPrefix: "Board Delete Error:" });
  }
};

/**
 * @desc Update board status by UUID
 * @route PUT /board/status/:uuid
 * @access Authenticated
 */
export const updateBoardStatus = async (req, res) => {
  try {
    const board = await boardService.updateBoardStatus(req.params.uuid, req.body.status);
    return sendResponse(res, 200, true, "board.status.success", { board });
  } catch (error) {
    return handleError(req, res, error, { logPrefix: "Board Status Update Error:" });
  }
};

/**
 * @desc Get board list context by user id
 * @route GET /board/:user_id/lists
 * @access Authenticated
 */
export const getBoardLists = async (req, res) => {
  try {
    const board = await boardService.getBoardLists(req.params.user_id);
    return sendResponse(res, 200, true, "board.get.success", { board });
  } catch (error) {
    return handleError(req, res, error, { logPrefix: "Board Get Error:" });
  }
};


