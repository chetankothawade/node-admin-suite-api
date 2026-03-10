import prisma from "../lib/prisma.js";

export class TaskRepository {
  constructor(db = prisma) {
    this.db = db;
  }

  count(where) { return this.db.task.count({ where }); }
  findMany(params) { return this.db.task.findMany(params); }
  create(data) { return this.db.task.create({ data }); }
  findByUuid(uuid, include) { return this.db.task.findFirst({ where: { uuid }, ...(include ? { include } : {}) }); }
  updateById(id, data) { return this.db.task.update({ where: { id }, data }); }
  deleteById(id) { return this.db.task.delete({ where: { id } }); }
  findById(id) { return this.db.task.findUnique({ where: { id } }); }
  findBoardById(id, include) { return this.db.board.findUnique({ where: { id }, ...(include ? { include } : {}) }); }
}

export const taskRepository = new TaskRepository();
