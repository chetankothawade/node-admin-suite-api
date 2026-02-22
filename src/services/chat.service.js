import { BaseService } from "./base.service.js";

export const chatService = {
  async createConversation() {
    BaseService.notImplemented("chat", "createConversation");
  },
  async sendMessage() {
    BaseService.notImplemented("chat", "sendMessage");
  },
  async getMessages() {
    BaseService.notImplemented("chat", "getMessages");
  },
  async markAsRead() {
    BaseService.notImplemented("chat", "markAsRead");
  },
  async markMessagesAsReadBatch() {
    BaseService.notImplemented("chat", "markMessagesAsReadBatch");
  },
  async getUserConversations() {
    BaseService.notImplemented("chat", "getUserConversations");
  },
  async getGroupConversations() {
    BaseService.notImplemented("chat", "getGroupConversations");
  },
  async getRecipientList() {
    BaseService.notImplemented("chat", "getRecipientList");
  },
  async getUnreadCounts() {
    BaseService.notImplemented("chat", "getUnreadCounts");
  },
  async deleteMessage() {
    BaseService.notImplemented("chat", "deleteMessage");
  },
};
