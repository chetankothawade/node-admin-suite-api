// controllers/chat.controller.js
import { sendResponse } from "../utils/response.js";
import { chatService } from "../services/chat.service.js";

export const createConversation = async (req, res) => {
  try {
    const { user_id, other_user_id, other_user_ids = [], type, name } = req.body;

    if (!user_id) return sendResponse(res, 400, false, "validation.missing_fields");
    if (type === "group" && (!Array.isArray(other_user_ids) || other_user_ids.length < 2)) {
      return sendResponse(res, 400, false, "validation.group_min_users");
    }
    if (type === "group" && !name) return sendResponse(res, 400, false, "validation.group_name_required");
    if (type === "direct" && !other_user_id) return sendResponse(res, 400, false, "validation.direct_requires_one_user");
    if (!["group", "direct"].includes(type)) return sendResponse(res, 400, false, "validation.invalid_type");

    const { conversation, isExisting } = await chatService.createConversation({
      user_id,
      other_user_id,
      other_user_ids,
      type,
      name,
    });

    return sendResponse(
      res,
      isExisting ? 200 : 201,
      true,
      isExisting ? "conversation.exists" : "conversation.create.success",
      { conversation }
    );
  } catch (error) {
    return sendResponse(res, error.status || 500, false, error.exposeMessage || error.message || "error.internal");
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { conversation_id, sender_id, message } = req.body;
    const uploadedFiles = req.files || [];

    if (!conversation_id || !sender_id) return sendResponse(res, 400, false, "validation.missing_fields");
    if ((!message || message.trim() === "") && uploadedFiles.length === 0) {
      return sendResponse(res, 400, false, "validation.missing_fields");
    }

    const formattedMessage = await chatService.sendMessage({
      ...req.body,
      uploadedFiles,
      base_url: `${req.protocol}://${req.get("host")}`,
    });

    return sendResponse(res, 201, true, "message.send.success", { message: formattedMessage });
  } catch (error) {
    return sendResponse(res, error.status || 500, false, error.exposeMessage || error.message || "error.internal");
  }
};

export const getMessages = async (req, res) => {
  try {
    const conversation_id = req.params.conversationId;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const order = req.query.order === "asc" ? "asc" : "desc";
    const search = req.query.search ? req.query.search.trim() : "";

    const { count, messages } = await chatService.getMessages({ conversation_id, page, limit, order, search });
    const totalPages = Math.ceil(count / limit);

    return sendResponse(res, 200, true, "message.list.success", {
      messages,
      pagination: {
        total: count,
        perPage: limit,
        currentPage: page,
        totalPages,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
      },
    });
  } catch (error) {
    return sendResponse(res, error.status || 500, false, error.exposeMessage || error.message || "error.internal");
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { user_id } = req.body;
    if (!user_id) return sendResponse(res, 400, false, "validation.missing_fields");

    const status = await chatService.markAsRead({ uuid: req.params.uuid, user_id });
    return sendResponse(res, 200, true, "message.read.success", { status });
  } catch (error) {
    return sendResponse(res, error.status || 500, false, error.exposeMessage || error.message || "error.internal");
  }
};

export const markMessagesAsReadBatch = async (req, res) => {
  try {
    const { user_id, message_ids } = req.body;
    if (!user_id || !Array.isArray(message_ids)) return sendResponse(res, 400, false, "validation.missing_fields");

    await chatService.markMessagesAsReadBatch({ user_id, message_ids });
    return sendResponse(res, 200, true, "messages.marked_as_read");
  } catch (error) {
    return sendResponse(res, error.status || 500, false, error.exposeMessage || error.message || "error.internal");
  }
};

export const getUserConversations = async (req, res) => {
  try {
    const conversations = await chatService.getUserConversations(req.params.userId);
    return sendResponse(res, 200, true, "conversation.list.success", { conversations });
  } catch (error) {
    return sendResponse(res, error.status || 500, false, error.exposeMessage || error.message || "error.internal");
  }
};

export const getGroupConversations = async (req, res) => {
  try {
    const conversations = await chatService.getGroupConversations(req.params.userId);
    const enriched = conversations.map((conv) => ({ ...conv, member_count: conv._count.members }));
    return sendResponse(res, 200, true, "conversation.list.success", { conversations: enriched });
  } catch (error) {
    return sendResponse(res, error.status || 500, false, error.exposeMessage || error.message || "error.internal");
  }
};

export const getRecipientList = async (req, res) => {
  try {
    const users = await chatService.getRecipientList(req.params.id);
    return sendResponse(res, 200, true, "user.list.success", { users });
  } catch (error) {
    return sendResponse(res, error.status || 500, false, error.exposeMessage || error.message || "error.internal");
  }
};

export const getUnreadCounts = async (req, res) => {
  try {
    const user_id = req.params.user_id || req.params.userId;
    if (!user_id) return sendResponse(res, 400, false, "validation.missing_fields");

    const unreadCounts = await chatService.getUnreadCounts(user_id);
    return sendResponse(res, 200, true, "unread.count.success", { unreadCounts });
  } catch (error) {
    return sendResponse(res, error.status || 500, false, error.exposeMessage || error.message || "error.internal");
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { user_id } = req.body;
    if (!req.params.uuid || !user_id) return sendResponse(res, 400, false, "validation.missing_fields");

    const message = await chatService.deleteMessage({ uuid: req.params.uuid, user_id });
    return sendResponse(res, 200, true, "message.delete.success", { message_uuid: message.uuid });
  } catch (error) {
    return sendResponse(res, error.status || 500, false, error.exposeMessage || error.message || "error.internal");
  }
};
