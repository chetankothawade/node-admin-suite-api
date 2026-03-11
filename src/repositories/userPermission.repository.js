import prisma from "../lib/prisma.js";

export class UserPermissionRepository {
  constructor(db = prisma) {
    this.db = db;
  }

  findUser(where, select) {
    return this.db.user.findUnique({ where, select });
  }

  findRoleModules(role) {
    return this.db.roleModule.findMany({
      where: { role },
      select: { module_id: true },
    });
  }

  findModules(params) {
    return this.db.module.findMany(params);
  }

  findPermissions(params) {
    return this.db.permission.findMany(params);
  }

  findModulePermissionById(id) {
    return this.db.modulePermission.findUnique({
      where: { id },
      select: { id: true },
    });
  }

  findModulePermissionByModuleAndPermission(module_id, permission_id) {
    return this.db.modulePermission.findFirst({
      where: { module_id, permission_id },
      select: { id: true },
    });
  }

  findModulePermissions(params = {}) {
    return this.db.modulePermission.findMany(params);
  }

  findUserPermissions(params = {}) {
    return this.db.userPermission.findMany(params);
  }

  upsertUserPermission(user_id, module_permission_id) {
    return this.db.userPermission.upsert({
      where: {
        user_id_module_permission_id: {
          user_id,
          module_permission_id,
        },
      },
      update: {},
      create: {
        user_id,
        module_permission_id,
      },
    });
  }

  deleteUserPermission(user_id, module_permission_id) {
    return this.db.userPermission.deleteMany({
      where: { user_id, module_permission_id },
    });
  }
}

export const userPermissionRepository = new UserPermissionRepository();
