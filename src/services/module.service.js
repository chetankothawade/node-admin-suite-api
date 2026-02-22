import { Op } from "sequelize";
import db from "../models/index.js";
import { BaseService } from "./base.service.js";
import { getPaginationParams, buildPaginationMeta } from "./pagination.service.js";

const { sequelize, Module, Permission, ModulePermission, UserPermission } = db;

export const moduleService = {
  async listModule({ params, query }) {
    const moduleId = params.id || 0;
    const { page, limit, offset, sortedField, sortedBy } = getPaginationParams(query);
    const search = query.search || "";

    const whereClause = {
      parentId: moduleId > 0 ? moduleId : 0,
      ...(search && {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { url: { [Op.like]: `%${search}%` } },
          { icon: { [Op.like]: `%${search}%` } },
        ],
      }),
    };

    const { count, rows } = await Module.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [[sortedField, sortedBy]],
    });

    return {
      module: rows || [],
      pagination: buildPaginationMeta(count || 0, page, limit),
    };
  },

  async createModule(payload) {
    const { name, url, icon, seqNo, isPermission = "N", isSubModule = "N", parentId = 0 } = payload;
    if (!name || !seqNo) {
      BaseService.throwError(400, "validation.missing_fields");
    }

    return sequelize.transaction(async (t) => {
      const newModule = await Module.create(
        { name, url, icon, seqNo, isPermission, isSubModule, parentId },
        { transaction: t }
      );

      if (isSubModule === "N" && isPermission === "Y") {
        const permissions = await Permission.findAll({
          where: { action: ["create", "read", "update", "delete", "approve"] },
          transaction: t,
        });

        const mappings = permissions.map((p) => ({
          moduleId: newModule.id,
          permissionId: p.id,
        }));
        await ModulePermission.bulkCreate(mappings, { transaction: t });
      }

      return newModule;
    });
  },

  async updateModule(uuid, payload) {
    const { name, url, icon, seqNo, isPermission = "N", isSubModule = "N", parentId } = payload;
    if (!name || !seqNo || !uuid) {
      BaseService.throwError(400, "validation.missing_fields");
    }

    return sequelize.transaction(async (t) => {
      const module = await Module.findOne({ where: { uuid }, transaction: t });
      if (!module) {
        BaseService.throwError(404, "error.not_found");
      }

      Object.assign(module, { name, url, icon, seqNo, isPermission, isSubModule, parentId });
      await module.save({ transaction: t });

      const existingMappings = await ModulePermission.findAll({
        where: { moduleId: module.id },
        transaction: t,
      });

      if (existingMappings.length === 0 && isPermission === "Y") {
        const permissions = await Permission.findAll({
          where: { action: ["create", "read", "update", "delete", "approve"] },
          transaction: t,
        });

        const mappings = permissions.map((p) => ({
          moduleId: module.id,
          permissionId: p.id,
        }));
        await ModulePermission.bulkCreate(mappings, { transaction: t });
      }

      if (existingMappings.length > 0 && isPermission === "N") {
        await ModulePermission.destroy({ where: { moduleId: module.id }, transaction: t });
      }

      return module;
    });
  },

  async deleteModule(uuid) {
    const module = await Module.findOne({ where: { uuid } });
    if (!module) {
      BaseService.throwError(404, "error.not_found");
    }
    await module.destroy();
  },

  async getModule(uuid) {
    const module = await Module.findOne({
      where: { uuid },
      include: [{ model: Module, as: "parent", attributes: ["id", "name"] }],
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

    const module = await Module.findOne({ where: { uuid } });
    if (!module) {
      BaseService.throwError(404, "error.not_found");
    }

    module.status = status;
    await module.save();
    return module;
  },

  getModuleList() {
    return Module.findAll({ where: { parentId: 0, isSubModule: "Y" } });
  },

  async getAllModuleList(query) {
    const userId = parseInt(query.userId, 10) || 5;

    const allModules = await Module.findAll({
      where: { status: "active" },
      attributes: ["id", "name", "url", "icon", "seqNo", "isSubModule", "parentId", "isPermission"],
      order: [["seqNo", "ASC"]],
      raw: true,
    });

    const parentMap = {};
    allModules.forEach((m) => {
      if (m.parentId === 0) parentMap[m.id] = m;
    });

    const resultModules = [];
    allModules.forEach((m) => {
      if (m.isPermission !== "Y") return;

      if (m.parentId === 0) {
        const hasSub = allModules.some((sub) => sub.parentId === m.id && sub.isPermission === "Y");
        if (!hasSub) resultModules.push({ ...m, displayName: m.name });
      } else {
        const parent = parentMap[m.parentId];
        resultModules.push({ ...m, displayName: parent ? `${parent.name} > ${m.name}` : m.name });
      }
    });

    const permissions = await Permission.findAll({
      where: { status: "active" },
      attributes: ["id", "action"],
      order: [["id", "ASC"]],
      raw: true,
    });

    const modulePermissions = await ModulePermission.findAll({
      attributes: ["id", "moduleId", "permissionId"],
      raw: true,
    });

    const userPermissions = await UserPermission.findAll({
      where: { userId },
      attributes: ["id", "modulePermissionId"],
      raw: true,
    });

    const modules = resultModules.map((mod) => ({
      ...mod,
      permissions: permissions.map((perm) => {
        const modulePerm = modulePermissions.find(
          (mp) => mp.moduleId === mod.id && mp.permissionId === perm.id
        );
        return { ...perm, modulePermissionId: modulePerm ? modulePerm.id : null };
      }),
    }));

    return { modules, userPermissions };
  },

  async toggleUserPermission(payload) {
    const { userId, modulePermissionId, isChecked } = payload;
    if (isChecked) {
      await UserPermission.findOrCreate({
        where: { userId, modulePermissionId },
        defaults: { userId, modulePermissionId },
      });
      return;
    }

    await UserPermission.destroy({ where: { userId, modulePermissionId } });
  },
};
