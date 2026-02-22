import { Op } from "sequelize";
import db from "../models/index.js";
import { BaseService } from "./base.service.js";
import { getPaginationParams, buildPaginationMeta } from "./pagination.service.js";

const { CMS, sequelize } = db;

export const cmsService = {
  async listCms(query) {
    const { page, limit, offset, sortedField, sortedBy } = getPaginationParams(query);
    const search = query.search || "";

    const whereClause = {
      ...(search && {
        [Op.or]: [{ title: { [Op.like]: `%${search}%` } }, { content: { [Op.like]: `%${search}%` } }],
      }),
    };

    const { count, rows } = await CMS.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [[sortedField, sortedBy]],
    });

    return { cms: rows || [], pagination: buildPaginationMeta(count || 0, page, limit) };
  },

  async createCms(payload) {
    const { title, content } = payload;
    if (!title || !content) {
      BaseService.throwError(400, "validation.missing_fields");
    }
    return CMS.create({ title, content });
  },

  async updateCms(uuid, payload) {
    const { title, content } = payload;
    if (!title || !content) {
      BaseService.throwError(400, "validation.missing_fields");
    }

    const cms = await CMS.findOne({ where: { uuid } });
    if (!cms) BaseService.throwError(404, "error.not_found");

    cms.title = title;
    cms.content = content;
    await cms.save();
    return cms;
  },

  async deleteCms(uuid) {
    const cms = await CMS.findOne({ where: { uuid } });
    if (!cms) BaseService.throwError(404, "error.not_found");
    await cms.destroy();
  },

  async getCms(uuid) {
    const cms = await CMS.findOne({
      where: { uuid },
      attributes: ["id", "uuid", "title", "content", "status", "createdAt"],
    });
    if (!cms) BaseService.throwError(404, "error.not_found");
    return cms;
  },

  async getCms1(uuid) {
    const [cms] = await sequelize.query(
      `SELECT id, uuid, title, content, status, createdAt
       FROM CMS
       WHERE uuid = :uuid
       LIMIT 1`,
      {
        replacements: { uuid },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    if (!cms) BaseService.throwError(404, "error.not_found");
    return cms;
  },

  async cmsStatus(uuid, status) {
    if (!status) BaseService.throwError(400, "validation.missing_fields");

    const cms = await CMS.findOne({ where: { uuid } });
    if (!cms) BaseService.throwError(404, "error.not_found");

    cms.status = status;
    await cms.save();
    return cms;
  },
};
