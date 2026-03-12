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
import { validateRequest } from "../middlewares/validateRequest.js";

const router = express.Router();


router.route("/list").get(isAuthenticated, listCategories);
router.route("/list/:id").get(isAuthenticated, listCategories);
router.route("/create").post(isAuthenticated, validateRequest("category.create"), createCategory);
router.route("/update/:uuid").put(isAuthenticated, validateRequest("category.update"), updateCategory);
router.route("/delete/:uuid").delete(isAuthenticated, validateRequest("category.delete"), deleteCategory);
router.route("/get/:uuid").get(isAuthenticated, validateRequest("category.get"), getCategory);
router.route("/status/:uuid").put(isAuthenticated, validateRequest("category.status"), updateCategoryStatus);
router.route("/getList").get(isAuthenticated, getCategoryList);
export default router;


