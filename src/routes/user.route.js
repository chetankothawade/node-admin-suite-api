// routes/user.route.js
import express from "express";
import {
    getMe,
    listUser,
    createUser,
    updateUser,
    deleteUser,
    getUser,
    userStatus,
    getUserList,
    exportUsersCSV
}
from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import authorizeRoles from "../middlewares/authorizeRoles.js";
import { uploadImage } from "../utils/multer.js";
import { validateRequest} from "../middlewares/validateRequest.js";
const router = express.Router();
const requireAdminAccess = authorizeRoles("admin", "super_admin");
/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/
router.route("/me").get(isAuthenticated, getMe);
router.route("/list").get(isAuthenticated, requireAdminAccess, listUser);
/*
|--------------------------------------------------------------------------
| Create User
|--------------------------------------------------------------------------
*/
router.route("/create").post(isAuthenticated, requireAdminAccess, uploadImage.single("avatar"), validateRequest("user.create"), createUser);
/*
|--------------------------------------------------------------------------
| Update User
|--------------------------------------------------------------------------
*/
router.route("/update/:uuid").put(isAuthenticated, requireAdminAccess, uploadImage.single("avatar"), validateRequest("user.update"), updateUser);
/*
|--------------------------------------------------------------------------
| Delete User
|--------------------------------------------------------------------------
*/
router.route("/delete/:uuid").patch(isAuthenticated, requireAdminAccess, validateRequest("user.delete"), deleteUser);
/*
|--------------------------------------------------------------------------
| Get User
|--------------------------------------------------------------------------
*/
router.route("/get/:uuid").get(isAuthenticated, requireAdminAccess, getUser);
/*
|--------------------------------------------------------------------------
| Update User Status
|--------------------------------------------------------------------------
*/
router.route("/status/:uuid").put(isAuthenticated, requireAdminAccess, validateRequest("user.status"), userStatus);
/*
|--------------------------------------------------------------------------
| Dropdown User List
|--------------------------------------------------------------------------
*/
router.route("/getList").get(isAuthenticated, requireAdminAccess, getUserList);
/*
|--------------------------------------------------------------------------
| Export Users CSV
|--------------------------------------------------------------------------
*/
router.route("/export/csv").get(isAuthenticated, requireAdminAccess, exportUsersCSV);

export default router;
