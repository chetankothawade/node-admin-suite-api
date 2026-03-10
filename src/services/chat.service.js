import { chatRepository } from "../repositories/chat.repository.js";
import { BaseService } from "./base.service.js";
import { Storage } from "./storage/storageManager.js";

export const chatService = {
  async createConversation({ user_id, other_user_id, other_user_ids = [], type, name }) {
    const current_user_id = Number(user_id);

    if (type === "group") {
      const userIds = [current_user_id, ...other_user_ids.map(Number)];
      const userCount = await chatRepository.user.count({ where: { id: { in: userIds } } });
      if (userCount !== userIds.length) BaseService.throwError(404, "validation.user_not_found");

      const conversation = await chatRepository.conversation.create({
        data: { type: "group", name, created_by: current_user_id },
      });

      await chatRepository.conversationMember.createMany({
        data: userIds.map((uid) => ({ conversation_id: conversation.id, user_id: uid })),
      });

      return { conversation, isExisting: false };
    }

    const recipientUserId = Number(other_user_id);
    const userIds = [current_user_id, recipientUserId];
    const userCount = await chatRepository.user.count({ where: { id: { in: userIds } } });
    if (userCount !== 2) BaseService.throwError(404, "validation.user_not_found");

    const existingConversations = await chatRepository.conversation.findMany({
      where: { type: "direct", members: { some: { user_id: current_user_id } } },
      include: { members: { select: { user_id: true } } },
    });

    const directConversation = existingConversations.find((conv) => {
      const memberIds = conv.members.map((m) => m.user_id);
      return memberIds.includes(current_user_id) && memberIds.includes(recipientUserId) && memberIds.length === 2;
    });

    if (directConversation) {
      return { conversation: directConversation, isExisting: true };
    }

    const conversation = await chatRepository.conversation.create({
      data: { type: "direct", created_by: current_user_id },
    });

    await chatRepository.conversationMember.createMany({
      data: [
        { conversation_id: conversation.id, user_id: current_user_id },
        { conversation_id: conversation.id, user_id: recipientUserId },
      ],
    });

    return { conversation, isExisting: false };
  },

  async sendMessage({ conversation_id, sender_id, message, message_type, reply_to_message_id, uploadedFiles = [], base_url }) {
    const numericConversationId = Number(conversation_id);
    const numericSenderId = Number(sender_id);

    const member = await chatRepository.conversationMember.findFirst({
      where: { conversation_id: numericConversationId, user_id: numericSenderId },
    });
    if (!member) BaseService.throwError(403, "error.not_allowed");

    const hasText = message && message.trim() !== "";
    const hasFiles = uploadedFiles.length > 0;

    let finalMessageType = "text";
    if (hasFiles && !hasText) finalMessageType = "file";
    else if (message_type) finalMessageType = message_type;

    const newMessage = await chatRepository.message.create({
      data: {
        conversation_id: numericConversationId,
        sender_id: numericSenderId,
        message: hasText ? message : "",
        message_type: finalMessageType,
        reply_to_message_id: reply_to_message_id ? Number(reply_to_message_id) : null,
      },
    });

    if (hasFiles) {
      const storedFiles = await Storage.putMultiple(uploadedFiles, "chat");

      await chatRepository.messageFile.createMany({
        data: storedFiles.map((stored, index) => {
          const file = uploadedFiles[index];
          const fileUrl = stored.url.startsWith("http") ? stored.url : `${base_url}${stored.url}`;
          return {
            message_id: newMessage.id,
            file_path: fileUrl,
            file_type: file.mimetype,
            file_size: BigInt(file.size),
          };
        }),
      });
    }

    const members = await chatRepository.conversationMember.findMany({ where: { conversation_id: numericConversationId } });
    await chatRepository.messageStatus.createMany({
      data: members.map((m) => ({
        message_id: newMessage.id,
        user_id: m.user_id,
        status: m.user_id === numericSenderId ? "sent" : "delivered",
      })),
    });

    const fullMessage = await chatRepository.message.findUnique({
      where: { id: newMessage.id },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
        files: { select: { id: true, file_path: true, file_type: true, file_size: true, uploaded_at: true } },
        reply_to_message: {
          select: {
            id: true,
            message: true,
            sender_id: true,
            sender: { select: { id: true, name: true } },
          },
        },
      },
    });

    return {
      id: fullMessage.id,
      conversation_id: fullMessage.conversation_id,
      sender_id: fullMessage.sender_id,
      message: fullMessage.message || "",
      message_type: fullMessage.message_type,
      created_at: fullMessage.created_at,
      updated_at: fullMessage.updated_at,
      sender: fullMessage.sender,
      files: (fullMessage.files || []).map((file) => ({
        ...file,
        file_size: file.file_size === null || file.file_size === undefined ? file.file_size : Number(file.file_size),
      })),
      reply_to_message: fullMessage.reply_to_message || [],
    };
  },

  async getMessages({ conversation_id, page = 1, limit = 10, order = "desc", search = "" }) {
    const whereClause = {
      conversation_id: Number(conversation_id),
      ...(search ? { message: { contains: search } } : {}),
    };

    const offset = (page - 1) * limit;

    const [count, messages] = await Promise.all([
      chatRepository.message.count({ where: whereClause }),
      chatRepository.message.findMany({
        where: whereClause,
        include: {
          sender: { select: { id: true, name: true, avatar: true } },
          files: { select: { id: true, file_path: true, file_type: true, file_size: true, uploaded_at: true } },
          reply_to_message: {
            select: {
              id: true,
              message: true,
              sender_id: true,
              sender: { select: { id: true, name: true } },
            },
          },
        },
        orderBy: { created_at: order === "asc" ? "asc" : "desc" },
        take: limit,
        skip: offset,
      }),
    ]);

    return { count, messages };
  },

  async markAsRead({ uuid, user_id }) {
    const message = await chatRepository.message.findFirst({ where: { uuid }, select: { id: true } });
    if (!message) BaseService.throwError(404, "error.not_found");

    const status = await chatRepository.messageStatus.findFirst({ where: { message_id: message.id, user_id: Number(user_id) } });
    if (!status) BaseService.throwError(404, "error.not_found");

    return chatRepository.messageStatus.update({ where: { id: status.id }, data: { status: "read" } });
  },

  async markMessagesAsReadBatch({ user_id, message_ids }) {
    return chatRepository.messageStatus.updateMany({
      data: { status: "read" },
      where: { user_id: Number(user_id), message_id: { in: message_ids.map(Number) }, status: { not: "read" } },
    });
  },

  async getUserConversations(user_id) {
    return chatRepository.conversation.findMany({
      where: { type: "direct", members: { some: { user_id: Number(user_id) } } },
      include: {
        members: { include: { user: { select: { id: true, name: true, avatar: true } } } },
        messages: {
          select: { id: true, sender_id: true, message: true, message_type: true, updated_at: true, created_at: true },
          orderBy: { created_at: "desc" },
          take: 1,
        },
      },
    });
  },

  async getGroupConversations(user_id) {
    return chatRepository.conversation.findMany({
      where: { type: "group", members: { some: { user_id: Number(user_id) } } },
      include: { _count: { select: { members: true } } },
      orderBy: { created_at: "desc" },
    });
  },

  async getRecipientList(sender_id) {
    return chatRepository.user.findMany({
      where: { id: { not: Number(sender_id) }, status: { not: "suspended" } },
      select: { id: true, name: true, avatar: true },
      orderBy: { name: "asc" },
    });
  },

  async getUnreadCounts(user_id) {
    const conversations = await chatRepository.conversation.findMany({
      where: { members: { some: { user_id: Number(user_id) } } },
      select: { id: true },
    });

    return Promise.all(
      conversations.map(async (conversation) => {
        const unreadCount = await chatRepository.message.count({
          where: {
            conversation_id: conversation.id,
            sender_id: { not: Number(user_id) },
            message_status: { some: { user_id: Number(user_id), status: { not: "read" } } },
          },
        });

        return { conversation_id: conversation.id, unreadCount };
      })
    );
  },

  async deleteMessage({ uuid, user_id }) {
    const message = await chatRepository.message.findFirst({ where: { uuid }, include: { files: true } });
    if (!message) BaseService.throwError(404, "message.not_found");
    if (message.sender_id !== Number(user_id)) BaseService.throwError(403, "error.not_allowed");

    await chatRepository.transaction([
      chatRepository.messageFile.deleteMany({ where: { message_id: message.id } }),
      chatRepository.messageStatus.deleteMany({ where: { message_id: message.id } }),
      chatRepository.message.delete({ where: { id: message.id } }),
    ]);

    return message;
  },
};
