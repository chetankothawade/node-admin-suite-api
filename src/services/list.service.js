import { listRepository } from "../repositories/list.repository.js";
import { BaseService } from "./base.service.js";
import { getPaginationParams, buildPaginationMeta } from "./pagination.service.js";

export const listService = {
  async listLists(query) {
    const { page, limit, offset, sorted_field, sorted_by } = getPaginationParams(query);
    const search = query.search || "";
    const board_id = query.board_id ? Number(query.board_id) : null;

    const whereClause = {
      ...(board_id && { board_id }),
      ...(search && { name: { contains: search } }),
    };

    const [count, rows] = await Promise.all([
      listRepository.count(whereClause),
      listRepository.findMany({
        where: whereClause,
        take: limit,
        skip: offset,
        orderBy: { [sorted_field]: sorted_by.toLowerCase() },
        include: {
          board: { select: { id: true, name: true } },
          tasks: { select: { id: true, title: true, status: true } },
        },
      }),
    ]);

    return { lists: rows, pagination: buildPaginationMeta(count || 0, page, limit) };
  },

  async createList(payload) {
    const { board_id, name, position } = payload;
    if (!board_id || !name) BaseService.throwError(400, "validation.missing_fields");

    const board = await listRepository.findBoardById(Number(board_id));
    if (!board) BaseService.throwError(404, "error.board_not_found");

    return listRepository.create({ board_id: Number(board_id), name, position: position ?? 0 });
  },

  async getList(uuid) {
    const list = await listRepository.findByUuid(uuid, {
        board: { select: { id: true, name: true } },
        tasks: { select: { id: true, title: true, status: true, position: true } },
        activity_logs: { select: { id: true, action: true, created_at: true } },
    });

    if (!list) BaseService.throwError(404, "error.not_found");
    return list;
  },

  async updateList(uuid, payload) {
    const { name, position } = payload;
    const list = await listRepository.findByUuid(uuid);
    if (!list) BaseService.throwError(404, "error.not_found");

    return listRepository.updateById(list.id, {
        ...(name ? { name } : {}),
        ...(position !== undefined ? { position } : {}),
    });
  },

  async deleteList(uuid) {
    const list = await listRepository.findByUuid(uuid);
    if (!list) BaseService.throwError(404, "error.not_found");
    await listRepository.deleteById(list.id);
  },
};


