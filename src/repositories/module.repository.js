import prisma from "../lib/prisma.js";

export class ModuleRepository {
  constructor(db = prisma) {
    this.db = db;
  }

  transaction(fn) { return this.db.$transaction(fn); }
  count(where) { return this.db.module.count({ where }); }
  findMany(params) { return this.db.module.findMany(params); }
  findByUuid(uuid, include) { return this.db.module.findFirst({ where: { uuid }, ...(include ? { include } : {}) }); }
  create(data) { return this.db.module.create({ data }); }
  updateById(id, data) { return this.db.module.update({ where: { id }, data }); }
  deleteById(id) { return this.db.module.delete({ where: { id } }); }

  findPermissions(where) { return this.db.permission.findMany({ where }); }
  findModulePermissions(params) { return this.db.modulePermission.findMany(params); }
  createModulePermissions(data) { return this.db.modulePermission.createMany({ data }); }
  deleteModulePermissions(where) { return this.db.modulePermission.deleteMany({ where }); }

  findUserPermissions(params) { return this.db.userPermission.findMany(params); }
  upsertUserPermission(where, create) { return this.db.userPermission.upsert({ where, update: {}, create }); }
  deleteUserPermissions(where) { return this.db.userPermission.deleteMany({ where }); }
}

export const moduleRepository = new ModuleRepository();
