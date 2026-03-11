import express from "express";

import authRoute from "../auth.route.js";
import userRoute from "../user.route.js";
import moduleRoute from "../module.route.js";
import cmsRoute from "../cms.route.js";
import editorRoute from "../editor.route.js";
import chatRoute from "../chat.route.js";
import categoryRoute from "../category.route.js";
import userPermissionRoute from "../userPermission.route.js";
import roleModule from "../roleModule.route.js";

const router = express.Router();

// Auth routes are mounted at /api/v1/*
router.use("/", authRoute);
router.use("/user", userRoute);
router.use("/module", moduleRoute);
router.use("/cms", cmsRoute);
router.use("/editor", editorRoute);
router.use("/chat", chatRoute);
router.use("/category", categoryRoute);
router.use("/user-permissions", userPermissionRoute);
router.use("/role-modules", roleModule);

export default router;
