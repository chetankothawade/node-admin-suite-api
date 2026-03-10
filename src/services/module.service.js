import { moduleRepository } from "../repositories/module.repository.js";
import { BaseService } from "./base.service.js";
import { getPaginationParams, buildPaginationMeta } from "./pagination.service.js";

export const moduleService = {
  async listModule({ params, query }) {
    const module_id = Number(params.id || 0);
    const { page, limit, offset, sorted_field, sorted_by } = getPaginationParams(query);
    const search = query.search || "";

    const whereClause = {
      parent_id: module_id > 0 ? module_id : 0,
      ...(search
        ? {
            OR: [
              { name: { contains: search } },
              { url: { contains: search } },
              { icon: { contains: search } },
            ],
          }
        : {}),
    };

    const [count, rows] = await Promise.all([
      moduleRepository.count(whereClause),
      moduleRepository.findMany({
        where: whereClause,
        take: limit,
        skip: offset,
        orderBy: { [sorted_field]: sorted_by.toLowerCase() },
      }),
    ]);

    return {
      module: rows || [],
      pagination: buildPaginationMeta(count || 0, page, limit),
    };
  },

  async createModule(payload) {
    const { name, url, icon, seq_no, is_permission = "N", is_sub_module = "N", parent_id = 0 } = payload;
    if (!name || !seq_no) {
      BaseService.throwError(400, "validation.missing_fields");
    }

    const newModule = await moduleRepository.create({
      name,
      url,
      icon,
      seq_no,
      is_permission,
      is_sub_module,
      parent_id: Number(parent_id),
    });

    if (is_sub_module === "N" && is_permission === "Y") {
      const permissions = await moduleRepository.findPermissions({
        action: { in: ["create", "read", "update", "delete", "approve"] },
      });

      if (permissions.length > 0) {
        await moduleRepository.createModulePermissions(
          permissions.map((p) => ({ module_id: newModule.id, permission_id: p.id }))
        );
      }
    }

    return newModule;
  },

  async updateModule(uuid, payload) {
    const { name, url, icon, seq_no, is_permission = "N", is_sub_module = "N", parent_id } = payload;
    if (!name || !seq_no || !uuid) {
      BaseService.throwError(400, "validation.missing_fields");
    }

    const module = await moduleRepository.findByUuid(uuid);
    if (!module) {
      BaseService.throwError(404, "error.not_found");
    }

    const updatedModule = await moduleRepository.updateById(module.id, {
      name,
      url,
      icon,
      seq_no,
      is_permission,
      is_sub_module,
      parent_id: parent_id !== undefined ? Number(parent_id) : module.parent_id,
    });

    const existingMappings = await moduleRepository.findModulePermissions({
      where: { module_id: module.id },
    });

    if (existingMappings.length === 0 && is_permission === "Y") {
      const permissions = await moduleRepository.findPermissions({
        action: { in: ["create", "read", "update", "delete", "approve"] },
      });

      if (permissions.length > 0) {
        await moduleRepository.createModulePermissions(
          permissions.map((p) => ({ module_id: module.id, permission_id: p.id }))
        );
      }
    }

    if (existingMappings.length > 0 && is_permission === "N") {
      await moduleRepository.deleteModulePermissions({ module_id: module.id });
    }

    return updatedModule;
  },

  async deleteModule(uuid) {
    const module = await moduleRepository.findByUuid(uuid);
    if (!module) {
      BaseService.throwError(404, "error.not_found");
    }
    await moduleRepository.deleteById(module.id);
  },

  async getModule(uuid) {
    const module = await moduleRepository.findByUuid(uuid, {
      parent: { select: { id: true, name: true } },
    });

    if (!module) {
      BaseService.throwError(404, "error.not_found");
    }
    return module;
  },

  async moduleStatus(uuid, status) {
    if (!status) {
      BaseService.throwError(400, "validation.missing_fields");
    }

    const module = await moduleRepository.findByUuid(uuid);
    if (!module) {
      BaseService.throwError(404, "error.not_found");
    }

    return moduleRepository.updateById(module.id, { status });
  },

  getModuleList() {
    return moduleRepository.findMany({ where: { parent_id: 0, is_sub_module: "Y" } });
  },

  getActiveModuleTree() {
    return moduleRepository.findMany({
      where: { parent_id: 0, status: "active" },
      orderBy: { seq_no: "asc" },
      include: {
        children: {
          where: { status: "active" },
          orderBy: { seq_no: "asc" },
        },
      },
    });
  },

  async getAllModuleList(query) {
    const user_id = parseInt(query.user_id, 10) || 5;

    const allModules = await moduleRepository.findMany({
      where: { status: "active" },
      select: {
        id: true,
        name: true,
        url: true,
        icon: true,
        seq_no: true,
        is_sub_module: true,
        parent_id: true,
        is_permission: true,
      },
      orderBy: { seq_no: "asc" },
    });

    const parentMap = {};
    allModules.forEach((m) => {
      if (m.parent_id === 0) parentMap[m.id] = m;
    });

    const resultModules = [];
    allModules.forEach((m) => {
      if (m.is_permission !== "Y") return;

      if (m.parent_id === 0) {
        const hasSub = allModules.some((sub) => sub.parent_id === m.id && sub.is_permission === "Y");
        if (!hasSub) resultModules.push({ ...m, displayName: m.name });
      } else {
        const parent = parentMap[m.parent_id];
        resultModules.push({ ...m, displayName: parent ? `${parent.name} > ${m.name}` : m.name });
      }
    });

    const permissions = await moduleRepository.findPermissions({ status: "active" });

    const module_permissions = await moduleRepository.findModulePermissions({
      select: { id: true, module_id: true, permission_id: true },
    });

    const user_permissions = await moduleRepository.findUserPermissions({
      where: { user_id },
      select: { id: true, module_permission_id: true },
    });

    const modules = resultModules.map((mod) => ({
      ...mod,
      permissions: permissions.map((perm) => {
        const modulePerm = module_permissions.find(
          (mp) => mp.module_id === mod.id && mp.permission_id === perm.id
        );
        return { ...perm, module_permission_id: modulePerm ? modulePerm.id : null };
      }),
    }));

    return { modules, user_permissions };
  },

  async toggleUserPermission(payload) {
    const { user_id, module_permission_id, isChecked } = payload;
    if (isChecked) {
      await moduleRepository.upsertUserPermission(
        {
          user_id_module_permission_id: {
            user_id: Number(user_id),
            module_permission_id: Number(module_permission_id),
          },
        },
        {
          user_id: Number(user_id),
          module_permission_id: Number(module_permission_id),
        }
      );
      return;
    }

    await moduleRepository.deleteUserPermissions({
      user_id: Number(user_id),
      module_permission_id: Number(module_permission_id),
    });
  },
};
