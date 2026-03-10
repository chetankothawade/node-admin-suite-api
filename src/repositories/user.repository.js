import prisma from "../lib/prisma.js";

class UserRepository {
  constructor() {
    this.model = prisma.user;
  }

  findByUuid(uuid, attributes = undefined) {
    return this.model.findFirst({
      where: { uuid },
      ...(attributes ? { select: this.buildSelect(attributes) } : {}),
    });
  }

  findByEmail(email) {
    return this.model.findUnique({ where: { email } });
  }

  findByEmailExcludingId(email, excludedUserId) {
    return this.model.findFirst({
      where: {
        email,
        id: { not: excludedUserId },
      },
    });
  }

  listUsers({ where, attributes, limit, offset, order }) {
    const orderBy = Array.isArray(order) && order.length > 0
      ? { [order[0][0]]: String(order[0][1]).toLowerCase() }
      : { createdAt: "desc" };

    return Promise.all([
      this.model.count({ where }),
      this.model.findMany({
        where,
        ...(attributes ? { select: this.buildSelect(attributes) } : {}),
        take: limit,
        skip: offset,
        orderBy,
      }),
    ]).then(([count, rows]) => ({ count, rows }));
  }

  listAdmins(attributes) {
    return this.model.findMany({
      where: { role: "admin", status: { not: "suspended" } },
      ...(attributes ? { select: this.buildSelect(attributes) } : {}),
    });
  }

  listForCsv(attributes) {
    return this.model.findMany({
      where: { status: { not: "suspended" } },
      ...(attributes ? { select: this.buildSelect(attributes) } : {}),
      orderBy: { createdAt: "desc" },
    });
  }

  findByPk(id, options = {}) {
    return this.model.findUnique({
      where: { id },
      ...(options.attributes ? { select: this.buildSelect(options.attributes) } : {}),
    });
  }

  create(payload) {
    return this.model.create({ data: payload });
  }

  buildSelect(attributes) {
    return attributes.reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
  }
}

export const userRepository = new UserRepository();
