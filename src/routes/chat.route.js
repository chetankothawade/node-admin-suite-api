// routes/chat.route.js
import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { uploadChat } from "../utils/multer.js";
import {
    sendMessage,
    getMessages,
    markAsRead,
    getUserConversations,
    createConversation,
    getRecipientList,
    getUnreadCounts,
    markMessagesAsReadBatch,
    getGroupConversations,
    deleteMessage
    
} from "../controllers/chat.controller.js";

const router = express.Router();

router.route("/conversation").post(isAuthenticated, createConversation);
router.route("/message").post(isAuthenticated, uploadChat.array("files", 5), sendMessage);  // up to 5 files 
router.route("/messages/:conversation_id").get(isAuthenticated, getMessages);
router.route("/message/:uuid/read").patch(isAuthenticated, markAsRead);
router.route("/message/read/batch").patch(isAuthenticated, markMessagesAsReadBatch);
router.route("/conversations/:user_id").get(isAuthenticated, getUserConversations);
router.route("/group-conversations/:user_id").get(isAuthenticated, getGroupConversations);
router.route("/recipients/:id").get(isAuthenticated, getRecipientList);
router.route("/unread-count/:user_id").get(isAuthenticated, getUnreadCounts);
router.route("/message/:uuid").delete(isAuthenticated, deleteMessage);


export default router;





