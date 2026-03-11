import { roleModuleRepository } from "../repositories/roleModule.repository.js";
import { moduleRepository } from "../repositories/module.repository.js";

export const roleModuleService = {

  /**
   * Same as Laravel matrix()
   */
  async matrix() {

    const roles = await roleModuleRepository.getRoles();

    const modules = await moduleRepository.findMany({
      where: { status: "active" },
      orderBy: { seq_no: "asc" }
    });

    const roleModules = await roleModuleRepository.findAll();

    // groupBy module_id
    const roleModuleMap = {};

    roleModules.forEach((rm) => {
      if (!roleModuleMap[rm.module_id]) {
        roleModuleMap[rm.module_id] = [];
      }
      roleModuleMap[rm.module_id].push(rm.role);
    });

    const matrix = modules.map((module) => {

      const permissions = {};

      roles.forEach((role) => {
        permissions[role] =
          roleModuleMap[module.id]?.includes(role) || false;
      });

      return {
        id: module.id,
        name: module.name,
        permissions,
      };
    });

    return {
      roles,
      modules: matrix,
    };
  },


  /**
   * Same as Laravel toggle()
   */
  async toggle(payload) {

    const { role, module_id, enabled } = payload;
    const normalizedRole = String(role || "").trim().toLowerCase();

    if (enabled) {

      await roleModuleRepository.upsert({
        role: normalizedRole,
        module_id: Number(module_id),
      });

      return;
    }

    await roleModuleRepository.delete({
      role: normalizedRole,
      module_id: Number(module_id),
    });
  },
};
