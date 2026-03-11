import prisma from "../lib/prisma.js";

export class ChatRepository {
  constructor(db = prisma) {
    this.db = db;
  }

  get user() { return this.db.user; }
  get conversation() { return this.db.conversation; }
  get conversationMember() { return this.db.conversationMember; }
  get message() { return this.db.message; }
  get messageFile() { return this.db.messageFile; }
  get messageStatus() { return this.db.messageStatus; }

  transaction(opsOrFn) {
    return this.db.$transaction(opsOrFn);
  }
}

export const chatRepository = new ChatRepository();
