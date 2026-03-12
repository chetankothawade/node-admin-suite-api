import { cmsRepository } from "../repositories/cms.repository.js";
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
    return cmsRepository.create({ title, content });
  },

  async updateCms(uuid, payload) {
    const { title, content } = payload;
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

  async cmsStatus(uuid, status) {
    const cms = await cmsRepository.findByUuid(uuid);
    if (!cms) BaseService.throwError(404, "error.not_found");

    return cmsRepository.updateById(cms.id, { status });
  },
};


