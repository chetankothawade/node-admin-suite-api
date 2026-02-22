//routes/user.route.js
import express from "express";
import { getMe, listUser, createUser, updateUser, deleteUser, getUser, userStatus, getUserList, exportUsersCSV } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { uploadImage } from '../utils/multer.js';

const router = express.Router();

router.route("/me").get(isAuthenticated, getMe);
router.route("/list").get(isAuthenticated, listUser);
router.route("/create").post(isAuthenticated, uploadImage.single("avatar"), createUser);
router.route("/update/:uuid").put(isAuthenticated, uploadImage.single("avatar"), updateUser);
router.route("/delete/:uuid").patch(isAuthenticated, deleteUser);
//router.route("/delete/:uuid").delete(isAuthenticated, deleteUser);
router.route("/get/:uuid").get(isAuthenticated, getUser);
router.route("/status/:uuid").put(isAuthenticated, userStatus);
router.route("/getList").get(isAuthenticated, getUserList);
router.route("/export/csv").get(isAuthenticated, exportUsersCSV);

export default router;
