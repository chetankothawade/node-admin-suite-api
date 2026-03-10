// routes/category.route.js
import express from "express";
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  updateCategoryStatus,
  getCategoryList
} from "../controllers/category.controller.js";

import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();


router.route("/list").get(isAuthenticated, listCategories);
router.route("/list/:id").get(isAuthenticated, listCategories);
router.route("/create").post(isAuthenticated, createCategory);
router.route("/update/:uuid").put(isAuthenticated, updateCategory);
router.route("/delete/:uuid").delete(isAuthenticated, deleteCategory);
router.route("/get/:uuid").get(isAuthenticated, getCategory);
router.route("/status/:uuid").put(isAuthenticated, updateCategoryStatus);
router.route("/getList").get(isAuthenticated, getCategoryList);
export default router;


