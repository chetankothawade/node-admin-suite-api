import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  toggleUserPermission,
  getUsersModulesPermission,
  userModuleAccess,
  sidebarMenu
} from "../controllers/userPermission.controller.js";

const router = express.Router();

router.use(isAuthenticated);

router.post("/toggle", toggleUserPermission);

router.get("/getAll/:uuid", getUsersModulesPermission);

router.get("/module-access/:uuid", userModuleAccess);

router.get("/side-menu", sidebarMenu);

export default router;
