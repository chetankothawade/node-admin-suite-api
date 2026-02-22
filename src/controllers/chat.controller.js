// controllers/chat.controller.js
import db from "../models/index.js";
import { sendResponse } from "../utils/response.js";
import { Op, Sequelize, literal } from "sequelize";
const { User, Conversation, ConversationMember, Message, MessageFile, MessageStatus } = db;
//import { io } from "../socket/server.js";


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

        let conversation;

        if (type === "group") {
            // GROUP CHAT → must have at least 2 members + a name
            if (!Array.isArray(otherUserIds) || otherUserIds.length < 2) {
                return sendResponse(res, 400, false, "validation.group_min_users");
            }
            if (!name) {
                return sendResponse(res, 400, false, "validation.group_name_required");
            }

            const userIds = [userId, ...otherUserIds];
            const users = await User.findAll({ where: { id: userIds } });
            if (users.length !== userIds.length) {
                return sendResponse(res, 404, false, "validation.user_not_found");
            }

            conversation = await Conversation.create({
                type: "group",
                name,
                createdBy: userId,
            });

            const members = userIds.map((uid) => ({
                conversationId: conversation.id,
                userId: uid,
            }));
            await ConversationMember.bulkCreate(members);

        } else if (type === "direct") {
            // DIRECT CHAT → must have exactly one other user
            if (!otherUserId) {
                return sendResponse(res, 400, false, "validation.direct_requires_one_user");
            }

            const users = await User.findAll({ where: { id: [userId, otherUserId] } });
            if (users.length !== 2) {
                return sendResponse(res, 404, false, "validation.user_not_found");
            }

            // Check if a direct chat already exists between these two users
            const existingConversations = await Conversation.findAll({
                where: { type: "direct" },
                include: [
                    {
                        model: ConversationMember,
                        as: "members",
                        attributes: ["userId"],
                    },
                ],
            });

            let directConversation = null;
            for (const conv of existingConversations) {
                const memberIds = conv.members.map((m) => m.userId);
                if (
                    memberIds.includes(Number(userId)) &&
                    memberIds.includes(Number(otherUserId)) &&
                    memberIds.length === 2 // ensure only these two users
                ) {
                    directConversation = conv;
                    break;
                }
            }

            if (directConversation) {
                return sendResponse(res, 200, true, "conversation.exists", {
                    conversation: directConversation,
                });
            }

            // Create new direct conversation
            conversation = await Conversation.create({
                type: "direct",
                createdBy: userId,
            });

            await ConversationMember.bulkCreate([
                { conversationId: conversation.id, userId },
                { conversationId: conversation.id, userId: otherUserId },
            ]);

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
        const uploadedFiles = req.files; // multer puts files here

        // Require conversationId and senderId
        if (!conversationId || !senderId) {
            return sendResponse(res, 400, false, "validation.missing_fields");
        }

        const hasText = message && message.trim() !== "";
        const hasFiles = uploadedFiles && uploadedFiles.length > 0;

        // Require at least text OR files
        if (!hasText && !hasFiles) {
            return sendResponse(res, 400, false, "validation.missing_fields");
        }

        // Check if user is part of the conversation
        const member = await ConversationMember.findOne({
            where: { conversationId, userId: senderId },
        });
        if (!member) return sendResponse(res, 403, false, "error.not_allowed");

        // Determine message type automatically
        let finalMessageType = "text";
        if (hasFiles && !hasText) finalMessageType = "file";
        else if (messageType) finalMessageType = messageType;

        // Create message
        const newMessage = await Message.create({
            conversationId,
            senderId,
            message: hasText ? message : "",
            messageType: finalMessageType,
            replyToMessageId: replyToMessageId || null,
        });

        // Save files if any
        let savedFiles = [];
        if (hasFiles) {
            const baseUrl = `${req.protocol}://${req.get("host")}`;
            savedFiles = await Promise.all(
                uploadedFiles.map((file) => {
                    const relativePath = file.destination.replace(/\\/g, "/").replace(/^uploads\//, "uploads/");
                    return MessageFile.create({
                        messageId: newMessage.id,
                        filePath: `${baseUrl}/${relativePath}/${file.filename}`,
                        fileType: file.mimetype,
                        fileSize: file.size,
                    });
                })
            );
        }

        // Create message status for all conversation members
        const members = await ConversationMember.findAll({ where: { conversationId } });
        await Promise.all(
            members.map((m) =>
                MessageStatus.create({
                    messageId: newMessage.id,
                    userId: m.userId,
                    status: m.userId === senderId ? "sent" : "delivered",
                })
            )
        );

        // Fetch full message details for response (same structure as getMessages)
        const fullMessage = await Message.findOne({
            where: { id: newMessage.id },
            include: [
                {
                    model: User,
                    as: "sender",
                    attributes: ["id", "name", "avatar"],
                },
                {
                    model: MessageFile,
                    as: "files",
                    attributes: ["id", "filePath", "fileType", "fileSize", "uploadedAt"],
                },
                {
                    model: Message,
                    as: "replyToMessage",
                    attributes: ["id", "message", "senderId"],
                    include: [
                        {
                            model: User,
                            attributes: ["id", "name"]
                        }
                    ]
                },
            ],
        });

        // Format response like getMessages
        const formattedMessage = {
            id: fullMessage.id,
            conversationId: fullMessage.conversationId,
            senderId: fullMessage.senderId,
            message: fullMessage.message || "",
            messageType: fullMessage.messageType,
            createdAt: fullMessage.createdAt,
            updatedAt: fullMessage.updatedAt,
            sender: fullMessage.sender,
            files: fullMessage.files || [],
            replyToMessage: fullMessage.replyToMessage || [],
        };

        // (Optional) Emit new message in real-time if using socket.io
        // io.to(`conversation_${conversationId}`).emit("newMessage", formattedMessage);

        // Broadcast message to all users in the same room
        // io.to(`conversation_${conversationId}`).emit("newMessage", {
        //     conversationId,
        //     message: newMessage,
        //     files: savedFiles,
        // });

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
        const conversationId = req.params.conversationId;
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        let offset = (page - 1) * limit;
        const orderDirection = req.query.order === "asc" ? "ASC" : "DESC";
        const search = req.query.search ? req.query.search.trim() : "";

        // Build dynamic where clause
        const whereClause = { conversationId };

        if (search) {
            whereClause[Op.or] = [
                { message: { [Op.like]: `%${search}%` } },
            ];
        }

        const { count, rows: messages } = await Message.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: User,
                    as: "sender",
                    attributes: ["id", "name", "avatar"],
                },
                {
                    model: MessageFile,
                    as: "files",
                    attributes: ["id", "filePath", "fileType", "fileSize", "uploadedAt"],
                },
                {
                    model: Message,
                    as: "replyToMessage",
                    attributes: ["id", "message", "senderId"],
                    include: [
                        {
                            model: User,
                            attributes: ["id", "name"]
                        }
                    ]
                },
            ],
            order: [["createdAt", orderDirection]],
            limit,
            offset,
        });

        const formattedMessages = messages.map((msg) => ({
            id: msg.id,
            conversationId: msg.conversationId,
            senderId: msg.senderId,
            message: msg.message || "",
            messageType: msg.messageType,
            createdAt: msg.createdAt,
            updatedAt: msg.updatedAt,
            sender: msg.sender,
            files: msg.files || [],
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
        const userId = req.body.userId;

        if (!userId) return sendResponse(res, 400, false, "validation.missing_fields");

        const message = await Message.findOne({
            where: { uuid: messageUuid },
            attributes: ["id"],
        });
        if (!message) return sendResponse(res, 404, false, "error.not_found");

        const status = await MessageStatus.findOne({ where: { messageId: message.id, userId } });
        if (!status) return sendResponse(res, 404, false, "error.not_found");

        status.status = "read";
        await status.save();

        return sendResponse(res, 200, true, "message.read.success", { status });
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

        await MessageStatus.update(
            { status: "read", readAt: new Date() },
            {
                where: {
                    userId,
                    messageId: { [Op.in]: messageIds },
                    status: { [Op.ne]: "read" }
                }
            }
        );

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
        const userId = req.params.userId;

        const conversations = await Conversation.findAll({
            where: { type: 'direct' },
            include: [
                {
                    model: ConversationMember,
                    as: "membershipCheck",
                    required: true, // only include conversations where user is a member
                    where: { userId }, // filter for current user
                },
                {
                    model: ConversationMember,
                    as: "members", // include all members for sender/receiver logic
                    required: false,
                    include: [
                        {
                            model: User,
                            attributes: ["id", "name", "avatar"]
                        }
                    ]
                },
                {
                    model: Message,
                    as: "messages",
                    attributes: ["id", "senderId", "message", "messageType", "updatedAt", "createdAt"],
                    separate: true,
                    limit: 1,
                    order: [["createdAt", "DESC"]],
                    // include: [
                    //     { model: User, as: "sender", attributes: ["id", "name", "avatar"] },
                    //     { model: MessageFile, as: "files" },
                    // ],
                },
            ],
        });

        // Sort conversations manually by latest message timestamp
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
        const userId = req.params.userId;

        const conversations = await Conversation.findAll({
            where: { type: 'group' },
            include: [
                {
                    model: ConversationMember,
                    as: "membershipCheck",
                    required: true,
                    where: { userId },
                },
            ],
            order: [["createdAt", "DESC"]],
        });

        const enriched = await Promise.all(
            conversations.map(async (conv) => {
                const count = await ConversationMember.count({
                    where: { conversationId: conv.id },
                });
                return { ...conv.toJSON(), memberCount: count };
            })
        );

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
        const senderId = req.params.id;
        const users = await User.findAll({
            where: { id: { [Op.ne]: senderId }, status: { [Op.ne]: "suspended" } },
            attributes: ["id", "name", "avatar"],
            order: [["name", "ASC"]],
        });
        return sendResponse(res, 200, true, "user.list.success", { users: users });
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
        const { userId } = req.params;

        if (!userId) return sendResponse(res, 400, false, "validation.missing_fields");

        // Get all conversations where the user is a member
        const conversations = await Conversation.findAll({
            include: [
                {
                    association: "members",
                    where: { userId },
                    attributes: []
                },
                {
                    association: "messages",
                    where: {
                        senderId: { [Op.ne]: userId } // exclude messages sent by the user
                    },
                    include: [
                        {
                            model: MessageStatus,
                            where: {
                                userId,
                                status: { [Op.ne]: "read" } // only unread
                            },
                            required: true
                        }
                    ]
                }
            ]
        });

        const unreadCounts = conversations.map((conversation) => ({
            conversationId: conversation.id,
            unreadCount: conversation.messages.length
        }));

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
        const { userId } = req.body; // senderId from frontend

        if (!messageUuid || !userId) {
            return sendResponse(res, 400, false, "validation.missing_fields");
        }

        // Find message with sender info
        const message = await Message.findOne({
            where: { uuid: messageUuid },
            include: [{ model: MessageFile, as: "files" }],
        });

        if (!message) {
            return sendResponse(res, 404, false, "message.not_found");
        }

        // Only sender can delete their own message
        if (message.senderId !== parseInt(userId)) {
            return sendResponse(res, 403, false, "error.not_allowed");
        }

        // Delete attached files if any (optional: remove from filesystem)
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

            await MessageFile.destroy({ where: { messageId: message.id } });
        }

        // Delete message statuses
        await MessageStatus.destroy({ where: { messageId: message.id } });

        // Delete the message itself
        await Message.destroy({ where: { id: message.id } });

        // Optional: broadcast deletion event to chat room
        // io.to(`conversation_${message.conversationId}`).emit("messageDeleted", { messageId });

        return sendResponse(res, 200, true, "message.delete.success", {
            messageUuid,
        });
    } catch (error) {
        console.error("Delete Message Error:", error);
        return sendResponse(res, 500, false, error.message || "error.internal");
    }
};
