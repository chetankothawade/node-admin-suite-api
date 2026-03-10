import prisma from "../lib/prisma.js";

export class AuthRepository {
  constructor(db = prisma) {
    this.db = db;
  }

  findUserByEmail(email, select) {
    return this.db.user.findUnique({ where: { email }, ...(select ? { select } : {}) });
  }

  createUser(data) {
    return this.db.user.create({ data });
  }

  updateUserById(id, data) {
    return this.db.user.update({ where: { id }, data });
  }

  findResettableUser(reset_password_token, now, select) {
    return this.db.user.findFirst({
      where: { reset_password_token, reset_password_expire: { gt: now } },
      ...(select ? { select } : {}),
    });
  }
}

export const authRepository = new AuthRepository();
