import { cmsRepository } from "../repositories/cms.repository.js";
import { Prisma } from "@prisma/client";
import { BaseService } from "./base.service.js";
import { getPaginationParams, buildPaginationMeta } from "./pagination.service.js";

export const cmsService = {
  async listCms(query) {
    const { page, limit, offset, sorted_field, sorted_by } = getPaginationParams(query);
    const search = query.search || "";

    const whereClause = search
      ? {
          OR: [{ title: { contains: search } }, { content: { contains: search } }],
        }
      : {};

    const [count, rows] = await Promise.all([
      cmsRepository.count(whereClause),
      cmsRepository.findMany({
        where: whereClause,
        take: limit,
        skip: offset,
        orderBy: { [sorted_field]: sorted_by.toLowerCase() },
      }),
    ]);

    return { cms: rows || [], pagination: buildPaginationMeta(count || 0, page, limit) };
  },

  async createCms(payload) {
    const { title, content } = payload;
    if (!title || !content) {
      BaseService.throwError(400, "validation.missing_fields");
    }
    return cmsRepository.create({ title, content });
  },

  async updateCms(uuid, payload) {
    const { title, content } = payload;
    if (!title || !content) {
      BaseService.throwError(400, "validation.missing_fields");
    }

    const cms = await cmsRepository.findByUuid(uuid);
    if (!cms) BaseService.throwError(404, "error.not_found");

    return cmsRepository.updateById(cms.id, { title, content });
  },

  async deleteCms(uuid) {
    const cms = await cmsRepository.findByUuid(uuid);
    if (!cms) BaseService.throwError(404, "error.not_found");
    await cmsRepository.deleteById(cms.id);
  },

  async getCms(uuid) {
    const cms = await cmsRepository.findByUuid(uuid, {
        id: true,
        uuid: true,
        title: true,
        content: true,
        status: true,
        created_at: true,
    });
    if (!cms) BaseService.throwError(404, "error.not_found");
    return cms;
  },

  async getCms1(uuid) {
    const result = await cmsRepository.queryRaw(
      Prisma.sql`SELECT id, uuid, title, content, status, created_at FROM cms WHERE uuid = ${uuid} LIMIT 1`
    );

    const cms = result?.[0];
    if (!cms) BaseService.throwError(404, "error.not_found");
    return cms;
  },

  async cmsStatus(uuid, status) {
    if (!status) BaseService.throwError(400, "validation.missing_fields");

    const cms = await cmsRepository.findByUuid(uuid);
    if (!cms) BaseService.throwError(404, "error.not_found");

    return cmsRepository.updateById(cms.id, { status });
  },
};


