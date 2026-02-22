// routes/list.route.js
import express from "express";
import {
  listLists,
  createList,
  updateList,
  deleteList,
  getList,
} from "../controllers/list.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/list").get(isAuthenticated, listLists);
router.route("/create").post(isAuthenticated, createList);
router.route("/update/:uuid").put(isAuthenticated, updateList);
router.route("/delete/:uuid").delete(isAuthenticated, deleteList);
router.route("/get/:uuid").get(isAuthenticated, getList);

export default router;
