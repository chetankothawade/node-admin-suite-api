import { boardRepository } from "../repositories/board.repository.js";
import { BaseService } from "./base.service.js";
import { getPaginationParams, buildPaginationMeta } from "./pagination.service.js";

export const boardService = {
  async listBoards(query) {
    const { page, limit, offset, sorted_field, sorted_by } = getPaginationParams(query);
    const search = query.search || "";

    const whereClause = search
      ? {
          OR: [
            { name: { contains: search } },
            { description: { contains: search } },
          ],
        }
      : {};

    const [count, rows] = await Promise.all([
      boardRepository.count(whereClause),
      boardRepository.findMany({
        where: whereClause,
        take: limit,
        skip: offset,
        orderBy: { [sorted_field]: sorted_by.toLowerCase() },
        include: {
          creator: { select: { id: true, name: true, email: true } },
          lists: { select: { id: true, name: true } },
        },
      }),
    ]);

    return { boards: rows, pagination: buildPaginationMeta(count || 0, page, limit) };
  },

  async createBoard(payload, user) {
    const { name, description } = payload;
    const created_by = user?.id || payload.created_by;
    if (!name || !created_by) {
      BaseService.throwError(400, "validation.missing_fields");
    }

    return boardRepository.create({ name, description, created_by });
  },

  async getBoard(uuid) {
    const board = await boardRepository.findByUuid(uuid, {
        creator: { select: { id: true, name: true, email: true } },
        lists: { select: { id: true, name: true, position: true } },
        activity_logs: { select: { id: true, action: true, created_at: true } },
    });

    if (!board) BaseService.throwError(404, "error.not_found");
    return board;
  },

  async updateBoard(uuid, payload) {
    const { name, description, status } = payload;
    const board = await boardRepository.findByUuid(uuid);
    if (!board) BaseService.throwError(404, "error.not_found");

    return boardRepository.updateById(board.id, {
        ...(name ? { name } : {}),
        ...(description ? { description } : {}),
        ...(status ? { status } : {}),
    });
  },

  async deleteBoard(uuid) {
    const board = await boardRepository.findByUuid(uuid);
    if (!board) BaseService.throwError(404, "error.not_found");
    await boardRepository.deleteById(board.id);
  },

  async updateBoardStatus(uuid, status) {
    if (!status) BaseService.throwError(400, "validation.missing_fields");

    const board = await boardRepository.findByUuid(uuid);
    if (!board) BaseService.throwError(404, "error.not_found");

    return boardRepository.updateById(board.id, { status });
  },

  async getBoardLists(user_id) {
    const board = await boardRepository.findById(Number(user_id));
    if (!board) BaseService.throwError(404, "error.not_found");
    return board;
  },
};


