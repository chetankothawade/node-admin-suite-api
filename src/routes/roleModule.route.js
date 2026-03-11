import express from "express";
import {
  roleModuleMatrix,
  toggleRoleModule
} from "../controllers/roleModule.controller.js";

const router = express.Router();

router.get("/matrix", roleModuleMatrix);

router.post("/toggle", toggleRoleModule);

export default router;