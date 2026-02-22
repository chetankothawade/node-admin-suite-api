// routes/task.route.js
import express from "express";
import {
  listTasks,
  createTask,
  updateTask,
  deleteTask,
  getTask,
  updateTaskStatus,
  getTaskList,
  updateTaskList
} from "../controllers/task.controller.js";

import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// Standard CRUD routes 
router.route("/list").get(isAuthenticated, listTasks);
router.route("/create").post(isAuthenticated, createTask);
router.route("/update/:uuid").put(isAuthenticated, updateTask);
router.route("/delete/:uuid").delete(isAuthenticated, deleteTask);
router.route("/get/:uuid").get(isAuthenticated, getTask);
router.route("/status/:uuid").put(isAuthenticated, updateTaskStatus);

// Additional task-board specific routes
router.route("/board/:boardId/tasks").get(isAuthenticated, getTaskList);
router.route("/update-task-list").put(isAuthenticated, updateTaskList);

export default router;
