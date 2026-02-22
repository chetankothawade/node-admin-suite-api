import { sendResponse, handleError } from "../utils/response.js";
import { taskService } from "../services/task.service.js";

/**
 * @desc List tasks with pagination/search
 * @route GET /task/list
 * @access Authenticated
 */
export const listTasks = async (req, res) => {
  try {
    const data = await taskService.listTasks(req.query);
    return sendResponse(res, 200, true, "task.list.success", data);
  } catch (error) {
    return handleError(req, res, error, { logPrefix: "Task List Error:" });
  }
};

/**
 * @desc Create a new task
 * @route POST /task/create
 * @access Authenticated
 */
export const createTask = async (req, res) => {
  try {
    const task = await taskService.createTask(req.body, req.user);
    return sendResponse(res, 201, true, "task.create.success", { task });
  } catch (error) {
    return handleError(req, res, error, { logPrefix: "Task Create Error:" });
  }
};

/**
 * @desc Update task by UUID
 * @route PUT /task/update/:uuid
 * @access Authenticated
 */
export const updateTask = async (req, res) => {
  try {
    const task = await taskService.updateTask(req.params.uuid, req.body);
    return sendResponse(res, 200, true, "task.update.success", { task });
  } catch (error) {
    return handleError(req, res, error, { logPrefix: "Task Update Error:" });
  }
};

/**
 * @desc Delete task by UUID
 * @route DELETE /task/delete/:uuid
 * @access Authenticated
 */
export const deleteTask = async (req, res) => {
  try {
    await taskService.deleteTask(req.params.uuid);
    return sendResponse(res, 200, true, "task.delete.success");
  } catch (error) {
    return handleError(req, res, error, { logPrefix: "Task Delete Error:" });
  }
};

/**
 * @desc Get task details by UUID
 * @route GET /task/get/:uuid
 * @access Authenticated
 */
export const getTask = async (req, res) => {
  try {
    const task = await taskService.getTask(req.params.uuid);
    return sendResponse(res, 200, true, "task.get.success", { task });
  } catch (error) {
    return handleError(req, res, error, { logPrefix: "Task Get Error:" });
  }
};

/**
 * @desc Update task status by UUID
 * @route PUT /task/status/:uuid
 * @access Authenticated
 */
export const updateTaskStatus = async (req, res) => {
  try {
    const task = await taskService.updateTaskStatus(req.params.uuid, req.body.status);
    return sendResponse(res, 200, true, "task.status.success", { task });
  } catch (error) {
    return handleError(req, res, error, { logPrefix: "Task Status Update Error:" });
  }
};

/**
 * @desc Get board with nested lists and tasks
 * @route GET /task/board/:boardId/tasks
 * @access Authenticated
 */
export const getTaskList = async (req, res) => {
  try {
    const board = await taskService.getTaskList(req.params.boardId);
    return sendResponse(res, 200, true, "board.tasks.success", { board });
  } catch (error) {
    return handleError(req, res, error, { logPrefix: "Get Task List Error:" });
  }
};

/**
 * @desc Move task from one list to another
 * @route PUT /task/update-task-list
 * @access Authenticated
 */
export const updateTaskList = async (req, res) => {
  try {
    const task = await taskService.updateTaskList(req.body);
    return sendResponse(res, 200, true, "task.list.update.success", { task });
  } catch (error) {
    return handleError(req, res, error, { logPrefix: "Update Task List Error:" });
  }
};
