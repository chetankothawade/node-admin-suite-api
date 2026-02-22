// routes/board.route.js
import express from "express";
import {
  listBoards,
  createBoard,
  updateBoard,
  deleteBoard,
  getBoard,
  updateBoardStatus,
  getBoardLists
} from "../controllers/board.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/list").get(isAuthenticated, listBoards);
router.route("/create").post(isAuthenticated, createBoard);
router.route("/update/:uuid").put(isAuthenticated, updateBoard);
router.route("/delete/:uuid").delete(isAuthenticated, deleteBoard);
router.route("/get/:uuid").get(isAuthenticated, getBoard);
router.route("/status/:uuid").put(isAuthenticated, updateBoardStatus);
router.route("/:userId/lists").get(isAuthenticated, getBoardLists);
export default router;
