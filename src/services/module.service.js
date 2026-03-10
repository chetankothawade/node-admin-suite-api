import prisma from "../lib/prisma.js";
import { BaseService } from "./base.service.js";
import { getPaginationParams, buildPaginationMeta } from "./pagination.service.js";

export const moduleService = {
  async listModule({ params, query }) {
    const moduleId = Number(params.id || 0);
    const { page, limit, offset, sortedField, sortedBy } = getPaginationParams(query);
    const search = query.search || "";

    const whereClause = {
      parentId: moduleId > 0 ? moduleId : 0,
      ...(search && {
        OR: [
          { name: { contains: search } },
          { url: { contains: search } },
          { icon: { contains: search } },
        ],
      }),
    };

    const [count, rows] = await Promise.all([
      prisma.module.count({ where: whereClause }),
      prisma.module.findMany({
        where: whereClause,
        take: limit,
        skip: offset,
        orderBy: { [sortedField]: sortedBy.toLowerCase() },
      }),
    ]);

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

    return prisma.$transaction(async (tx) => {
      const newModule = await tx.module.create({
        data: { name, url, icon, seqNo, isPermission, isSubModule, parentId: Number(parentId) },
      });

      if (isSubModule === "N" && isPermission === "Y") {
        const permissions = await tx.permission.findMany({
          where: { action: { in: ["create", "read", "update", "delete", "approve"] } },
        });

        if (permissions.length > 0) {
          await tx.modulePermission.createMany({
            data: permissions.map((p) => ({ moduleId: newModule.id, permissionId: p.id })),
          });
        }
      }

      return newModule;
    });
  },

  async updateModule(uuid, payload) {
    const { name, url, icon, seqNo, isPermission = "N", isSubModule = "N", parentId } = payload;
    if (!name || !seqNo || !uuid) {
      BaseService.throwError(400, "validation.missing_fields");
    }

    return prisma.$transaction(async (tx) => {
      const module = await tx.module.findFirst({ where: { uuid } });
      if (!module) {
        BaseService.throwError(404, "error.not_found");
      }

      const updatedModule = await tx.module.update({
        where: { id: module.id },
        data: { name, url, icon, seqNo, isPermission, isSubModule, parentId: parentId !== undefined ? Number(parentId) : module.parentId },
      });

      const existingMappings = await tx.modulePermission.findMany({
        where: { moduleId: module.id },
      });

      if (existingMappings.length === 0 && isPermission === "Y") {
        const permissions = await tx.permission.findMany({
          where: { action: { in: ["create", "read", "update", "delete", "approve"] } },
        });

        if (permissions.length > 0) {
          await tx.modulePermission.createMany({
            data: permissions.map((p) => ({ moduleId: module.id, permissionId: p.id })),
          });
        }
      }

      if (existingMappings.length > 0 && isPermission === "N") {
        await tx.modulePermission.deleteMany({ where: { moduleId: module.id } });
      }

      return updatedModule;
    });
  },

  async deleteModule(uuid) {
    const module = await prisma.module.findFirst({ where: { uuid } });
    if (!module) {
      BaseService.throwError(404, "error.not_found");
    }
    await prisma.module.delete({ where: { id: module.id } });
  },

  async getModule(uuid) {
    const module = await prisma.module.findFirst({
      where: { uuid },
      include: {
        parent: { select: { id: true, name: true } },
      },
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

    const module = await prisma.module.findFirst({ where: { uuid } });
    if (!module) {
      BaseService.throwError(404, "error.not_found");
    }

    return prisma.module.update({
      where: { id: module.id },
      data: { status },
    });
  },

  getModuleList() {
    return prisma.module.findMany({ where: { parentId: 0, isSubModule: "Y" } });
  },

  async getAllModuleList(query) {
    const userId = parseInt(query.userId, 10) || 5;

    const allModules = await prisma.module.findMany({
      where: { status: "active" },
      select: {
        id: true,
        name: true,
        url: true,
        icon: true,
        seqNo: true,
        isSubModule: true,
        parentId: true,
        isPermission: true,
      },
      orderBy: { seqNo: "asc" },
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

    const permissions = await prisma.permission.findMany({
      where: { status: "active" },
      select: { id: true, action: true },
      orderBy: { id: "asc" },
    });

    const modulePermissions = await prisma.modulePermission.findMany({
      select: { id: true, moduleId: true, permissionId: true },
    });

    const userPermissions = await prisma.userPermission.findMany({
      where: { userId },
      select: { id: true, modulePermissionId: true },
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
      await prisma.userPermission.upsert({
        where: {
          userId_modulePermissionId: {
            userId: Number(userId),
            modulePermissionId: Number(modulePermissionId),
          },
        },
        update: {},
        create: {
          userId: Number(userId),
          modulePermissionId: Number(modulePermissionId),
        },
      });
      return;
    }

    await prisma.userPermission.deleteMany({
      where: {
        userId: Number(userId),
        modulePermissionId: Number(modulePermissionId),
      },
    });
  },
};
