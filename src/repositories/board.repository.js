import prisma from "../lib/prisma.js";

export class BoardRepository {
  constructor(db = prisma) {
    this.db = db;
  }

  count(where) { return this.db.board.count({ where }); }
  findMany(params) { return this.db.board.findMany(params); }
  create(data) { return this.db.board.create({ data }); }
  findByUuid(uuid, include) { return this.db.board.findFirst({ where: { uuid }, ...(include ? { include } : {}) }); }
  updateById(id, data) { return this.db.board.update({ where: { id }, data }); }
  deleteById(id) { return this.db.board.delete({ where: { id } }); }
  findById(id) { return this.db.board.findUnique({ where: { id } }); }
}

export const boardRepository = new BoardRepository();
