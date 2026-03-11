import { moduleRepository } from "../repositories/module.repository.js";
import { BaseService } from "./base.service.js";
import { getPaginationParams, buildPaginationMeta } from "./pagination.service.js";

const DEFAULT_PERMISSION_ACTIONS = ["create", "read", "update", "delete", "approve"];

const toYN = (value, fallback = "N") => {
  if (value === "Y" || value === "N") return value;
  if (typeof value === "string") {
    const normalized = value.toUpperCase();
    if (normalized === "Y" || normalized === "N") return normalized;
  }
  return fallback;
};

const toParentId = (isSubModule, parentId) => {
  if (isSubModule === "Y") return Number(parentId || 0);
  return 0;
};

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
    const {
      name,
      url,
      icon,
      seq_no,
      parent_id,
    } = payload;

    const is_permission = toYN(payload.is_permission, "N");
    const is_sub_module = toYN(payload.is_sub_module, "N");

    if (!name || seq_no === undefined || seq_no === null) {
      BaseService.throwError(400, "validation.missing_fields");
    }

    return moduleRepository.transaction(async (tx) => {
      const moduleData = {
        name,
        url,
        icon,
        seq_no: Number(seq_no),
        is_permission,
        is_sub_module,
        parent_id: toParentId(is_sub_module, parent_id),
      };

      const newModule = await moduleRepository.create(moduleData, tx);

      if (is_permission === "Y") {
        const permissions = await moduleRepository.findPermissions({
          action: { in: DEFAULT_PERMISSION_ACTIONS },
        }, tx);

        if (permissions.length > 0) {
          await moduleRepository.createModulePermissions(
            permissions.map((permission) => ({
              module_id: newModule.id,
              permission_id: permission.id,
            })),
            tx
          );
        }
      }

      await moduleRepository.createRoleModule({
        module_id: newModule.id,
        role: "super_admin",
      }, tx);

      return newModule;
    });
  },

  async updateModule(uuid, payload) {
    const {
      name,
      url,
      icon,
      seq_no,
      parent_id,
    } = payload;

    const is_permission = toYN(payload.is_permission, "N");
    const is_sub_module = toYN(payload.is_sub_module, "N");

    if (!name || seq_no === undefined || seq_no === null || !uuid) {
      BaseService.throwError(400, "validation.missing_fields");
    }

    const module = await moduleRepository.findByUuid(uuid);
    if (!module) {
      BaseService.throwError(404, "error.not_found");
    }

    return moduleRepository.transaction(async (tx) => {
      const updateData = {
        name,
        url,
        icon,
        seq_no: Number(seq_no),
        is_permission,
        is_sub_module,
        parent_id: toParentId(is_sub_module, parent_id),
      };

      const updatedModule = await moduleRepository.updateById(module.id, updateData, tx);

      const existingMappings = await moduleRepository.findModulePermissions({
        where: { module_id: module.id },
      }, tx);

      if (is_permission === "Y" && existingMappings.length === 0) {
        const permissions = await moduleRepository.findPermissions({
          action: { in: DEFAULT_PERMISSION_ACTIONS },
        }, tx);

        if (permissions.length > 0) {
          await moduleRepository.createModulePermissions(
            permissions.map((permission) => ({
              module_id: module.id,
              permission_id: permission.id,
            })),
            tx
          );
        }
      }

      if (is_permission !== "Y" && existingMappings.length > 0) {
        await moduleRepository.deleteModulePermissions({ module_id: module.id }, tx);
      }

      return updatedModule;
    });
  },

  async deleteModule(uuid) {
    const module = await moduleRepository.findByUuid(uuid);
    if (!module) {
      BaseService.throwError(404, "error.not_found");
    }

    await moduleRepository.transaction(async (tx) => {
      await moduleRepository.deleteModulePermissions({ module_id: module.id }, tx);
      await moduleRepository.deleteRoleModules({ module_id: BigInt(module.id) }, tx);
      await moduleRepository.deleteById(module.id, tx);
    });
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
    return moduleRepository.findMany({
      where: { parent_id: 0, is_sub_module: "N", status: "active" },
      orderBy: [{ seq_no: "asc" }, { id: "asc" }],
    });
  },
};
