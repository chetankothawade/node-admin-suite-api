import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { listModule, createModule, updateModule, deleteModule, getModule, moduleStatus, getModuleList, getAllModuleList, toggleUserPermission } from "../controllers/module.controller.js";
import prisma from "../lib/prisma.js";

const router = express.Router();

// 🔹 Get all modules with submodules
router.route("/").get(isAuthenticated, async (req, res) => {
    try {
        const modules = await prisma.module.findMany({
            where: { parentId: 0, status: "active" },
            orderBy: { seqNo: "asc" },
            include: {
                children: {
                    where: { status: "active" },
                    orderBy: { seqNo: "asc" },
                },
            },
        });
        res.json({ success: true, modules });
    } catch (err) {
        console.error("Error fetching modules:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

router.route("/list").get(isAuthenticated, listModule);
router.route("/list/:id").get(isAuthenticated, listModule);
router.route("/create").post(isAuthenticated, createModule);
router.route("/update/:uuid").put(isAuthenticated, updateModule);
router.route("/delete/:uuid").delete(isAuthenticated, deleteModule);
router.route("/get/:uuid").get(isAuthenticated, getModule);
router.route("/status/:uuid").put(isAuthenticated, moduleStatus);
router.route("/getList").get(isAuthenticated, getModuleList);
router.route("/getAllList").get(isAuthenticated, getAllModuleList);
router.route("/toggleUserPermission").post(isAuthenticated, toggleUserPermission);

export default router;

