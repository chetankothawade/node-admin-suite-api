//routes/cms.route.js
import express from "express";
import { listCms, createCms, updateCms, deleteCms, getCms, cmsStatus } from "../controllers/cms.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/list").get(isAuthenticated, listCms);
router.route("/create").post(isAuthenticated, createCms);
router.route("/update/:uuid").put(isAuthenticated, updateCms);
router.route("/delete/:uuid").delete(isAuthenticated, deleteCms);
router.route("/get/:uuid").get(isAuthenticated, getCms);
router.route("/status/:uuid").put(isAuthenticated, cmsStatus);

export default router;


