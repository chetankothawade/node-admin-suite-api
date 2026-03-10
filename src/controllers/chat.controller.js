// controllers/chat.controller.js
import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/response.js";

/**
 * @desc Create a conversation (text/file)
 * @route POST /chat/conversation
 * @access Authenticated
 */
export const createConversation = async (req, res) => {
  try {
    const { userId, otherUserId, otherUserIds = [], type, name } = req.body;

    if (!userId) {
      return sendResponse(res, 400, false, "validation.missing_fields");
    }

    const currentUserId = Number(userId);
    let conversation;

    if (type === "group") {
      if (!Array.isArray(otherUserIds) || otherUserIds.length < 2) {
        return sendResponse(res, 400, false, "validation.group_min_users");
      }
      if (!name) {
        return sendResponse(res, 400, false, "validation.group_name_required");
      }

      const userIds = [currentUserId, ...otherUserIds.map(Number)];
      const userCount = await prisma.user.count({ where: { id: { in: userIds } } });
      if (userCount !== userIds.length) {
        return sendResponse(res, 404, false, "validation.user_not_found");
      }

      conversation = await prisma.conversation.create({
        data: {
          type: "group",
          name,
          createdBy: currentUserId,
        },
      });

      await prisma.conversationMember.createMany({
        data: userIds.map((uid) => ({ conversationId: conversation.id, userId: uid })),
      });
    } else if (type === "direct") {
      if (!otherUserId) {
        return sendResponse(res, 400, false, "validation.direct_requires_one_user");
      }

      const recipientUserId = Number(otherUserId);
      const userIds = [currentUserId, recipientUserId];
      const userCount = await prisma.user.count({ where: { id: { in: userIds } } });
      if (userCount !== 2) {
        return sendResponse(res, 404, false, "validation.user_not_found");
      }

      const existingConversations = await prisma.conversation.findMany({
        where: {
          type: "direct",
          members: {
            some: { userId: currentUserId },
          },
        },
        include: {
          members: {
            select: { userId: true },
          },
        },
      });

      const directConversation = existingConversations.find((conv) => {
        const memberIds = conv.members.map((m) => m.userId);
        return (
          memberIds.includes(currentUserId) &&
          memberIds.includes(recipientUserId) &&
          memberIds.length === 2
        );
      });

      if (directConversation) {
        return sendResponse(res, 200, true, "conversation.exists", {
          conversation: directConversation,
        });
      }

      conversation = await prisma.conversation.create({
        data: {
          type: "direct",
          createdBy: currentUserId,
        },
      });

      await prisma.conversationMember.createMany({
        data: [
          { conversationId: conversation.id, userId: currentUserId },
          { conversationId: conversation.id, userId: recipientUserId },
        ],
      });
    } else {
      return sendResponse(res, 400, false, "validation.invalid_type");
    }

    return sendResponse(res, 201, true, "conversation.create.success", {
      conversation,
    });
  } catch (error) {
    console.error("Create Conversation Error:", error);
    return sendResponse(res, 500, false, error.message || "error.internal");
  }
};

/**
 * @desc Send a message (text/file)
 * @route POST /chat/message
 * @access Authenticated
 */
export const sendMessage = async (req, res) => {
  try {
    const { conversationId, senderId, message, messageType, replyToMessageId } = req.body;
    const uploadedFiles = req.files;

    if (!conversationId || !senderId) {
      return sendResponse(res, 400, false, "validation.missing_fields");
    }

    const numericConversationId = Number(conversationId);
    const numericSenderId = Number(senderId);
    const hasText = message && message.trim() !== "";
    const hasFiles = uploadedFiles && uploadedFiles.length > 0;

    if (!hasText && !hasFiles) {
      return sendResponse(res, 400, false, "validation.missing_fields");
    }

    const member = await prisma.conversationMember.findFirst({
      where: { conversationId: numericConversationId, userId: numericSenderId },
    });
    if (!member) return sendResponse(res, 403, false, "error.not_allowed");

    let finalMessageType = "text";
    if (hasFiles && !hasText) finalMessageType = "file";
    else if (messageType) finalMessageType = messageType;

    const newMessage = await prisma.message.create({
      data: {
        conversationId: numericConversationId,
        senderId: numericSenderId,
        message: hasText ? message : "",
        messageType: finalMessageType,
        replyToMessageId: replyToMessageId ? Number(replyToMessageId) : null,
      },
    });

    if (hasFiles) {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      await prisma.messageFile.createMany({
        data: uploadedFiles.map((file) => {
          const relativePath = file.destination.replace(/\\/g, "/").replace(/^uploads\//, "uploads/");
          return {
            messageId: newMessage.id,
            filePath: `${baseUrl}/${relativePath}/${file.filename}`,
            fileType: file.mimetype,
            fileSize: BigInt(file.size),
          };
        }),
      });
    }

    const members = await prisma.conversationMember.findMany({ where: { conversationId: numericConversationId } });
    await prisma.messageStatus.createMany({
      data: members.map((m) => ({
        messageId: newMessage.id,
        userId: m.userId,
        status: m.userId === numericSenderId ? "sent" : "delivered",
      })),
    });

    const fullMessage = await prisma.message.findUnique({
      where: { id: newMessage.id },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
        files: { select: { id: true, filePath: true, fileType: true, fileSize: true, uploadedAt: true } },
        replyToMessage: {
          select: {
            id: true,
            message: true,
            senderId: true,
            sender: { select: { id: true, name: true } },
          },
        },
      },
    });

    const formattedMessage = {
      id: fullMessage.id,
      conversationId: fullMessage.conversationId,
      senderId: fullMessage.senderId,
      message: fullMessage.message || "",
      messageType: fullMessage.messageType,
      createdAt: fullMessage.createdAt,
      updatedAt: fullMessage.updatedAt,
      sender: fullMessage.sender,
      files: (fullMessage.files || []).map((file) => ({
        ...file,
        fileSize: file.fileSize === null || file.fileSize === undefined ? file.fileSize : Number(file.fileSize),
      })),
      replyToMessage: fullMessage.replyToMessage || [],
    };

    return sendResponse(res, 201, true, "message.send.success", {
      message: formattedMessage,
    });
  } catch (error) {
    console.error("Send Message Error:", error);
    return sendResponse(res, 500, false, error.message || "error.internal");
  }
};

/**
 * @desc Get messages from a conversation (with pagination)
 * @route GET /chat/messages/:conversationId
 * @access Authenticated
 */
export const getMessages = async (req, res) => {
  try {
    const conversationId = Number(req.params.conversationId);
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;
    const orderDirection = req.query.order === "asc" ? "asc" : "desc";
    const search = req.query.search ? req.query.search.trim() : "";

    const whereClause = {
      conversationId,
      ...(search && { message: { contains: search } }),
    };

    const [count, messages] = await Promise.all([
      prisma.message.count({ where: whereClause }),
      prisma.message.findMany({
        where: whereClause,
        include: {
          sender: { select: { id: true, name: true, avatar: true } },
          files: { select: { id: true, filePath: true, fileType: true, fileSize: true, uploadedAt: true } },
          replyToMessage: {
            select: {
              id: true,
              message: true,
              senderId: true,
              sender: { select: { id: true, name: true } },
            },
          },
        },
        orderBy: { createdAt: orderDirection },
        take: limit,
        skip: offset,
      }),
    ]);

    const formattedMessages = messages.map((msg) => ({
      id: msg.id,
      conversationId: msg.conversationId,
      senderId: msg.senderId,
      message: msg.message || "",
      messageType: msg.messageType,
      createdAt: msg.createdAt,
      updatedAt: msg.updatedAt,
      sender: msg.sender,
      files: (msg.files || []).map((file) => ({
        ...file,
        fileSize: file.fileSize === null || file.fileSize === undefined ? file.fileSize : Number(file.fileSize),
      })),
      replyToMessage: msg.replyToMessage || [],
    }));

    const totalPages = Math.ceil(count / limit);

    return sendResponse(res, 200, true, "message.list.success", {
      messages: formattedMessages,
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
    console.error("Get Message Error:", error);
    return sendResponse(res, 500, false, error.message || "error.internal");
  }
};

/**
 * @desc Mark a message as read
 * @route PATCH /chat/message/:uuid/read
 * @access Authenticated
 */
export const markAsRead = async (req, res) => {
  try {
    const messageUuid = req.params.uuid;
    const userId = Number(req.body.userId);

    if (!userId) return sendResponse(res, 400, false, "validation.missing_fields");

    const message = await prisma.message.findFirst({
      where: { uuid: messageUuid },
      select: { id: true },
    });

    if (!message) return sendResponse(res, 404, false, "error.not_found");

    const status = await prisma.messageStatus.findFirst({ where: { messageId: message.id, userId } });
    if (!status) return sendResponse(res, 404, false, "error.not_found");

    const updatedStatus = await prisma.messageStatus.update({
      where: { id: status.id },
      data: { status: "read" },
    });

    return sendResponse(res, 200, true, "message.read.success", { status: updatedStatus });
  } catch (error) {
    console.error("Mark As Read Error:", error);
    return sendResponse(res, 500, false, error.message || "error.internal");
  }
};

/**
 * @desc Mark a bulk message as read
 * @route PATCH /message/read/batch
 * @access Authenticated
 */
export const markMessagesAsReadBatch = async (req, res) => {
  try {
    const { userId, messageIds } = req.body;

    if (!userId || !Array.isArray(messageIds)) {
      return sendResponse(res, 400, false, "validation.missing_fields");
    }

    await prisma.messageStatus.updateMany({
      data: { status: "read" },
      where: {
        userId: Number(userId),
        messageId: { in: messageIds.map(Number) },
        status: { not: "read" },
      },
    });

    return sendResponse(res, 200, true, "messages.marked_as_read");
  } catch (error) {
    console.error("Batch Read Error:", error);
    return sendResponse(res, 500, false, "error.internal");
  }
};

/**
 * @desc Get user conversations
 * @route GET /chat/conversations/:userId
 * @access Authenticated
 */
export const getUserConversations = async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    const conversations = await prisma.conversation.findMany({
      where: {
        type: "direct",
        members: {
          some: { userId },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        messages: {
          select: {
            id: true,
            senderId: true,
            message: true,
            messageType: true,
            updatedAt: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    const sortedConversations = conversations.sort((a, b) => {
      const aMessage = a.messages[0];
      const bMessage = b.messages[0];
      const aTime = aMessage ? new Date(aMessage.createdAt).getTime() : 0;
      const bTime = bMessage ? new Date(bMessage.createdAt).getTime() : 0;
      return bTime - aTime;
    });

    return sendResponse(res, 200, true, "conversation.list.success", { conversations: sortedConversations });
  } catch (error) {
    console.error("Get User Conversation Error:", error);
    return sendResponse(res, 500, false, error.message || "error.internal");
  }
};

/**
 * @desc Get group conversations
 * @route GET /chat/group-conversations/:userId
 * @access Authenticated
 */
export const getGroupConversations = async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    const conversations = await prisma.conversation.findMany({
      where: {
        type: "group",
        members: {
          some: { userId },
        },
      },
      include: {
        _count: {
          select: { members: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const enriched = conversations.map((conv) => ({
      ...conv,
      memberCount: conv._count.members,
    }));

    return sendResponse(res, 200, true, "conversation.list.success", { conversations: enriched });
  } catch (error) {
    console.error("Get User Conversation Error:", error);
    return sendResponse(res, 500, false, error.message || "error.internal");
  }
};

/**
 * @desc Get Recipient List
 * @route Get /chat/recipient-list/:id
 * @access Authenticated
 */
export const getRecipientList = async (req, res) => {
  try {
    const senderId = Number(req.params.id);
    const users = await prisma.user.findMany({
      where: {
        id: { not: senderId },
        status: { not: "suspended" },
      },
      select: { id: true, name: true, avatar: true },
      orderBy: { name: "asc" },
    });
    return sendResponse(res, 200, true, "user.list.success", { users });
  } catch (error) {
    console.error("Get user list error:", error);
    return sendResponse(res, 500, false, "error.internal");
  }
};

/**
 * @desc Get unread message counts for all conversations for a user
 * @route GET /chat/unread-count/:userId
 * @access Authenticated
 */
export const getUnreadCounts = async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    if (!userId) return sendResponse(res, 400, false, "validation.missing_fields");

    const conversations = await prisma.conversation.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
      select: { id: true },
    });

    const unreadCounts = await Promise.all(
      conversations.map(async (conversation) => {
        const unreadCount = await prisma.message.count({
          where: {
            conversationId: conversation.id,
            senderId: { not: userId },
            messageStatus: {
              some: {
                userId,
                status: { not: "read" },
              },
            },
          },
        });

        return {
          conversationId: conversation.id,
          unreadCount,
        };
      })
    );

    return sendResponse(res, 200, true, "unread.count.success", { unreadCounts });
  } catch (error) {
    console.error("Unread Count Error:", error);
    return sendResponse(res, 500, false, error.message || "error.internal");
  }
};

/**
 * @desc Delete a message (only by sender)
 * @route DELETE /chat/message/:uuid
 * @access Authenticated
 */
export const deleteMessage = async (req, res) => {
  try {
    const messageUuid = req.params.uuid;
    const userId = Number(req.body.userId);

    if (!messageUuid || !userId) {
      return sendResponse(res, 400, false, "validation.missing_fields");
    }

    const message = await prisma.message.findFirst({
      where: { uuid: messageUuid },
      include: { files: true },
    });

    if (!message) {
      return sendResponse(res, 404, false, "message.not_found");
    }

    if (message.senderId !== userId) {
      return sendResponse(res, 403, false, "error.not_allowed");
    }

    if (message.files && message.files.length > 0) {
      await Promise.all(
        message.files.map(async (file) => {
          try {
            const fs = await import("fs");
            const filePath = file.filePath.replace(`${req.protocol}://${req.get("host")}/`, "");
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          } catch (err) {
            console.warn("File delete failed:", err.message);
          }
        })
      );
    }

    await prisma.$transaction([
      prisma.messageFile.deleteMany({ where: { messageId: message.id } }),
      prisma.messageStatus.deleteMany({ where: { messageId: message.id } }),
      prisma.message.delete({ where: { id: message.id } }),
    ]);

    return sendResponse(res, 200, true, "message.delete.success", {
      messageUuid,
    });
  } catch (error) {
    console.error("Delete Message Error:", error);
    return sendResponse(res, 500, false, error.message || "error.internal");
  }
};
