//routes/cms.route.js
import express from "express";
import { listCms, createCms, updateCms, deleteCms, getCms, cmsStatus } from "../controllers/cms.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { validateRequest } from "../middlewares/validateRequest.js";

const router = express.Router();

router.route("/list").get(isAuthenticated, listCms);
router.route("/create").post(isAuthenticated, validateRequest("cms.create"), createCms);
router.route("/update/:uuid").put(isAuthenticated, validateRequest("cms.update"), updateCms);
router.route("/delete/:uuid").delete(isAuthenticated, validateRequest("cms.delete"), deleteCms);
router.route("/get/:uuid").get(isAuthenticated, validateRequest("cms.get"), getCms);
router.route("/status/:uuid").put(isAuthenticated, validateRequest("cms.status"), cmsStatus);

export default router;


