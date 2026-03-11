import prisma from "../lib/prisma.js";

export const roleModuleRepository = {

  findAll() {
    return prisma.roleModule.findMany();
  },

  getRoles() {
    return ["super_admin", "admin", "user"];
  },

  upsert(data) {
    const moduleId = BigInt(data.module_id);
    return prisma.roleModule.upsert({
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
  },

  delete(where) {
    const moduleId = where?.module_id !== undefined ? BigInt(where.module_id) : undefined;
    return prisma.roleModule.deleteMany({
      where: {
        ...where,
        ...(moduleId !== undefined ? { module_id: moduleId } : {}),
      },
    });
  },
};
