import prisma from "../lib/prisma.js";
import { BaseService } from "./base.service.js";
import { getPaginationParams, buildPaginationMeta } from "./pagination.service.js";

export const categoryService = {
  async listCategories({ params, query }) {
    const { page, limit, offset, sortedField, sortedBy } = getPaginationParams(query);
    const search = query.search || "";
    const parentId = params.id ? Number(params.id) : null;

    const where = {
      parentId,
      ...(search && { name: { contains: search } }),
    };

    const [count, rows] = await Promise.all([
      prisma.category.count({ where }),
      prisma.category.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { [sortedField]: sortedBy.toLowerCase() },
        include: {
          subcategories: true,
          parent: true,
        },
      }),
    ]);

    return {
      categories: rows,
      pagination: buildPaginationMeta(count || 0, page, limit),
    };
  },

  async createCategory(payload) {
    const { name, parentId } = payload;
    if (!name) BaseService.throwError(400, "validation.missing_fields");

    return prisma.category.create({
      data: { name, parentId: parentId ? Number(parentId) : null },
    });
  },

  async updateCategory(uuid, payload) {
    const { name, parentId } = payload;
    const category = await prisma.category.findFirst({ where: { uuid } });
    if (!category) BaseService.throwError(404, "error.not_found");

    return prisma.category.update({
      where: { id: category.id },
      data: {
        ...(name ? { name } : {}),
        ...(parentId !== undefined ? { parentId: parentId === null ? null : Number(parentId) } : {}),
      },
    });
  },

  async deleteCategory(uuid) {
    const category = await prisma.category.findFirst({ where: { uuid } });
    if (!category) BaseService.throwError(404, "error.not_found");
    await prisma.category.delete({ where: { id: category.id } });
  },

  async getCategory(uuid) {
    const category = await prisma.category.findFirst({
      where: { uuid },
      include: { subcategories: true },
    });

    if (!category) BaseService.throwError(404, "error.not_found");
    return category;
  },

  async updateCategoryStatus(uuid, status) {
    if (status === undefined) BaseService.throwError(400, "validation.missing_fields");

    const category = await prisma.category.findFirst({ where: { uuid } });
    if (!category) BaseService.throwError(404, "error.not_found");

    return prisma.category.update({
      where: { id: category.id },
      data: { status },
    });
  },

  getCategoryList() {
    return prisma.category.findMany({
      where: {
        OR: [{ parentId: 0 }, { parentId: null }],
      },
    });
  },
};
