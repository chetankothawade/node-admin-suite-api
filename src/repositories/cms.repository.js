import prisma from "../lib/prisma.js";

export class CmsRepository {
  constructor(db = prisma) {
    this.db = db;
  }

  count(where) { return this.db.cms.count({ where }); }
  findMany(params) { return this.db.cms.findMany(params); }
  create(data) { return this.db.cms.create({ data }); }
  findByUuid(uuid, select) { return this.db.cms.findFirst({ where: { uuid }, ...(select ? { select } : {}) }); }
  updateById(id, data) { return this.db.cms.update({ where: { id }, data }); }
  deleteById(id) { return this.db.cms.delete({ where: { id } }); }
}

export const cmsRepository = new CmsRepository();
