import prisma from "../lib/prisma.js";

export class UserRepository {
  constructor(db = prisma) {
    this.db = db;
  }

  buildSelect(fields = []) {
    if (!fields || fields.length === 0) return undefined;

    return fields.reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
  }

  async createUser(data, fields = []) {
    return this.db.user.create({
      data,
      ...(fields.length > 0 ? { select: this.buildSelect(fields) } : {}),
    });
  }

  async getUsers({ where = {}, page = 1, limit = 10, orderBy = { created_at: "desc" }, fields = [] } = {}) {
    const skip = (page - 1) * limit;

    const [total, users] = await Promise.all([
      this.db.user.count({ where }),
      this.db.user.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        ...(fields.length > 0 ? { select: this.buildSelect(fields) } : {}),
      }),
    ]);

    return { total, users };
  }

  async getUserById(id, fields = []) {
    return this.db.user.findUnique({
      where: { id },
      ...(fields.length > 0 ? { select: this.buildSelect(fields) } : {}),
    });
  }

  async getUserByUuid(uuid, fields = []) {
    return this.db.user.findFirst({
      where: { uuid },
      ...(fields.length > 0 ? { select: this.buildSelect(fields) } : {}),
    });
  }

  async getUserByEmailExcludingId(email, excludedId, fields = []) {
    return this.db.user.findFirst({
      where: {
        email,
        id: { not: excludedId },
      },
      ...(fields.length > 0 ? { select: this.buildSelect(fields) } : {}),
    });
  }

  async updateUser(id, data, fields = []) {
    return this.db.user.update({
      where: { id },
      data,
      ...(fields.length > 0 ? { select: this.buildSelect(fields) } : {}),
    });
  }

  async listAdmins(fields = []) {
    return this.db.user.findMany({
      where: { role: "admin", status: { not: "suspended" } },
      ...(fields.length > 0 ? { select: this.buildSelect(fields) } : {}),
    });
  }

  async listForCsv(fields = []) {
    return this.db.user.findMany({
      where: { status: { not: "suspended" } },
      orderBy: { created_at: "desc" },
      ...(fields.length > 0 ? { select: this.buildSelect(fields) } : {}),
    });
  }
}
