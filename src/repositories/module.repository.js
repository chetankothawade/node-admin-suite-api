import prisma from "../lib/prisma.js";

export class ModuleRepository {
  constructor(db = prisma) {
    this.db = db;
  }

  transaction(fn) { return this.db.$transaction(fn); }
  count(where) { return this.db.module.count({ where }); }
  findMany(params) { return this.db.module.findMany(params); }
  findByUuid(uuid, include) {
    return this.db.module.findFirst({
      where: { uuid },
      ...(include ? { include } : {}),
    });
  }

  create(data, tx = this.db) { return tx.module.create({ data }); }
  updateById(id, data, tx = this.db) { return tx.module.update({ where: { id }, data }); }
  deleteById(id, tx = this.db) { return tx.module.delete({ where: { id } }); }

  findPermissions(where, tx = this.db) { return tx.permission.findMany({ where }); }
  findModulePermissions(params, tx = this.db) { return tx.modulePermission.findMany(params); }
  createModulePermissions(data, tx = this.db) { return tx.modulePermission.createMany({ data }); }
  deleteModulePermissions(where, tx = this.db) { return tx.modulePermission.deleteMany({ where }); }
  deleteRoleModules(where, tx = this.db) { return tx.roleModule.deleteMany({ where }); }
  createRoleModule(data, tx = this.db) {
    const moduleId = BigInt(data.module_id);
    return tx.roleModule.upsert({
      where: {
        role_module_id: {
          role: data.role,
          module_id: moduleId,
        },
      },
      update: {},
      create: {
        role: data.role,
        module_id: moduleId,
      },
    });
  }
}

export const moduleRepository = new ModuleRepository();
