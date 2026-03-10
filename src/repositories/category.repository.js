import prisma from "../lib/prisma.js";

export class CategoryRepository {
  constructor(db = prisma) {
    this.db = db;
  }

  count(where) { return this.db.category.count({ where }); }
  findMany(params) { return this.db.category.findMany(params); }
  create(data) { return this.db.category.create({ data }); }
  findByUuid(uuid, include) { return this.db.category.findFirst({ where: { uuid }, ...(include ? { include } : {}) }); }
  updateById(id, data) { return this.db.category.update({ where: { id }, data }); }
  deleteById(id) { return this.db.category.delete({ where: { id } }); }
}

export const categoryRepository = new CategoryRepository();
