import prisma from "../lib/prisma.js";
import { Prisma } from "@prisma/client";
import { BaseService } from "./base.service.js";
import { getPaginationParams, buildPaginationMeta } from "./pagination.service.js";

export const cmsService = {
  async listCms(query) {
    const { page, limit, offset, sortedField, sortedBy } = getPaginationParams(query);
    const search = query.search || "";

    const whereClause = search
      ? {
          OR: [{ title: { contains: search } }, { content: { contains: search } }],
        }
      : {};

    const [count, rows] = await Promise.all([
      prisma.cms.count({ where: whereClause }),
      prisma.cms.findMany({
        where: whereClause,
        take: limit,
        skip: offset,
        orderBy: { [sortedField]: sortedBy.toLowerCase() },
      }),
    ]);

    return { cms: rows || [], pagination: buildPaginationMeta(count || 0, page, limit) };
  },

  async createCms(payload) {
    const { title, content } = payload;
    if (!title || !content) {
      BaseService.throwError(400, "validation.missing_fields");
    }
    return prisma.cms.create({ data: { title, content } });
  },

  async updateCms(uuid, payload) {
    const { title, content } = payload;
    if (!title || !content) {
      BaseService.throwError(400, "validation.missing_fields");
    }

    const cms = await prisma.cms.findFirst({ where: { uuid } });
    if (!cms) BaseService.throwError(404, "error.not_found");

    return prisma.cms.update({
      where: { id: cms.id },
      data: { title, content },
    });
  },

  async deleteCms(uuid) {
    const cms = await prisma.cms.findFirst({ where: { uuid } });
    if (!cms) BaseService.throwError(404, "error.not_found");
    await prisma.cms.delete({ where: { id: cms.id } });
  },

  async getCms(uuid) {
    const cms = await prisma.cms.findFirst({
      where: { uuid },
      select: {
        id: true,
        uuid: true,
        title: true,
        content: true,
        status: true,
        createdAt: true,
      },
    });
    if (!cms) BaseService.throwError(404, "error.not_found");
    return cms;
  },

  async getCms1(uuid) {
    const result = await prisma.$queryRaw(
      Prisma.sql`SELECT id, uuid, title, content, status, createdAt FROM cms WHERE uuid = ${uuid} LIMIT 1`
    );

    const cms = result?.[0];
    if (!cms) BaseService.throwError(404, "error.not_found");
    return cms;
  },

  async cmsStatus(uuid, status) {
    if (!status) BaseService.throwError(400, "validation.missing_fields");

    const cms = await prisma.cms.findFirst({ where: { uuid } });
    if (!cms) BaseService.throwError(404, "error.not_found");

    return prisma.cms.update({
      where: { id: cms.id },
      data: { status },
    });
  },
};
