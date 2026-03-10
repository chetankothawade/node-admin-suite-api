import prisma from "../lib/prisma.js";
import { BaseService } from "./base.service.js";
import { getPaginationParams, buildPaginationMeta } from "./pagination.service.js";

export const listService = {
  async listLists(query) {
    const { page, limit, offset, sortedField, sortedBy } = getPaginationParams(query);
    const search = query.search || "";
    const boardId = query.boardId ? Number(query.boardId) : null;

    const whereClause = {
      ...(boardId && { boardId }),
      ...(search && { name: { contains: search } }),
    };

    const [count, rows] = await Promise.all([
      prisma.list.count({ where: whereClause }),
      prisma.list.findMany({
        where: whereClause,
        take: limit,
        skip: offset,
        orderBy: { [sortedField]: sortedBy.toLowerCase() },
        include: {
          board: { select: { id: true, name: true } },
          tasks: { select: { id: true, title: true, status: true } },
        },
      }),
    ]);

    return { lists: rows, pagination: buildPaginationMeta(count || 0, page, limit) };
  },

  async createList(payload) {
    const { boardId, name, position } = payload;
    if (!boardId || !name) BaseService.throwError(400, "validation.missing_fields");

    const board = await prisma.board.findUnique({ where: { id: Number(boardId) } });
    if (!board) BaseService.throwError(404, "error.board_not_found");

    return prisma.list.create({
      data: { boardId: Number(boardId), name, position: position ?? 0 },
    });
  },

  async getList(uuid) {
    const list = await prisma.list.findFirst({
      where: { uuid },
      include: {
        board: { select: { id: true, name: true } },
        tasks: { select: { id: true, title: true, status: true, position: true } },
        activityLogs: { select: { id: true, action: true, createdAt: true } },
      },
    });

    if (!list) BaseService.throwError(404, "error.not_found");
    return list;
  },

  async updateList(uuid, payload) {
    const { name, position } = payload;
    const list = await prisma.list.findFirst({ where: { uuid } });
    if (!list) BaseService.throwError(404, "error.not_found");

    return prisma.list.update({
      where: { id: list.id },
      data: {
        ...(name ? { name } : {}),
        ...(position !== undefined ? { position } : {}),
      },
    });
  },

  async deleteList(uuid) {
    const list = await prisma.list.findFirst({ where: { uuid } });
    if (!list) BaseService.throwError(404, "error.not_found");
    await prisma.list.delete({ where: { id: list.id } });
  },
};
