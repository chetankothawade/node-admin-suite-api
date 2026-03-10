import { categoryRepository } from "../repositories/category.repository.js";
import { BaseService } from "./base.service.js";
import { getPaginationParams, buildPaginationMeta } from "./pagination.service.js";

export const categoryService = {
  async listCategories({ params, query }) {
    const { page, limit, offset, sorted_field, sorted_by } = getPaginationParams(query);
    const search = query.search || "";
    const parent_id = params.id ? Number(params.id) : null;

    const where = {
      parent_id,
      ...(search && { name: { contains: search } }),
    };

    const [count, rows] = await Promise.all([
      categoryRepository.count(where),
      categoryRepository.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { [sorted_field]: sorted_by.toLowerCase() },
        include: {
          sub_categories: true,
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
    const { name, parent_id } = payload;
    if (!name) BaseService.throwError(400, "validation.missing_fields");

    return categoryRepository.create({ name, parent_id: parent_id ? Number(parent_id) : null });
  },

  async updateCategory(uuid, payload) {
    const { name, parent_id } = payload;
    const category = await categoryRepository.findByUuid(uuid);
    if (!category) BaseService.throwError(404, "error.not_found");

    return categoryRepository.updateById(category.id, {
        ...(name ? { name } : {}),
        ...(parent_id !== undefined ? { parent_id: parent_id === null ? null : Number(parent_id) } : {}),
    });
  },

  async deleteCategory(uuid) {
    const category = await categoryRepository.findByUuid(uuid);
    if (!category) BaseService.throwError(404, "error.not_found");
    await categoryRepository.deleteById(category.id);
  },

  async getCategory(uuid) {
    const category = await categoryRepository.findByUuid(uuid, { sub_categories: true });

    if (!category) BaseService.throwError(404, "error.not_found");
    return category;
  },

  async updateCategoryStatus(uuid, status) {
    if (status === undefined) BaseService.throwError(400, "validation.missing_fields");

    const category = await categoryRepository.findByUuid(uuid);
    if (!category) BaseService.throwError(404, "error.not_found");

    return categoryRepository.updateById(category.id, { status });
  },

  getCategoryList() {
    return categoryRepository.findMany({
      where: {
        OR: [{ parent_id: 0 }, { parent_id: null }],
      },
    });
  },
};


