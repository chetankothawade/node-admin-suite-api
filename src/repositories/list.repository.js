import prisma from "../lib/prisma.js";

export class ListRepository {
  constructor(db = prisma) {
    this.db = db;
  }

  count(where) { return this.db.list.count({ where }); }
  findMany(params) { return this.db.list.findMany(params); }
  create(data) { return this.db.list.create({ data }); }
  findByUuid(uuid, include) { return this.db.list.findFirst({ where: { uuid }, ...(include ? { include } : {}) }); }
  updateById(id, data) { return this.db.list.update({ where: { id }, data }); }
  deleteById(id) { return this.db.list.delete({ where: { id } }); }
  findBoardById(id) { return this.db.board.findUnique({ where: { id } }); }
}

export const listRepository = new ListRepository();
