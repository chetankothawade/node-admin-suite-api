import db from "../models/index.js";

const { Conversation, ConversationMember, Message, MessageFile, MessageStatus, User } = db;

export const chatRepository = {
  models: {
    Conversation,
    ConversationMember,
    Message,
    MessageFile,
    MessageStatus,
    User,
  },
};
