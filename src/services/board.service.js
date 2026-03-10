import prisma from "../lib/prisma.js";
import { BaseService } from "./base.service.js";
import { getPaginationParams, buildPaginationMeta } from "./pagination.service.js";

export const boardService = {
  async listBoards(query) {
    const { page, limit, offset, sortedField, sortedBy } = getPaginationParams(query);
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
      prisma.board.count({ where: whereClause }),
      prisma.board.findMany({
        where: whereClause,
        take: limit,
        skip: offset,
        orderBy: { [sortedField]: sortedBy.toLowerCase() },
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
    const createdBy = user?.id || payload.createdBy;
    if (!name || !createdBy) {
      BaseService.throwError(400, "validation.missing_fields");
    }

    return prisma.board.create({
      data: { name, description, createdBy },
    });
  },

  async getBoard(uuid) {
    const board = await prisma.board.findFirst({
      where: { uuid },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        lists: { select: { id: true, name: true, position: true } },
        activityLogs: { select: { id: true, action: true, createdAt: true } },
      },
    });

    if (!board) BaseService.throwError(404, "error.not_found");
    return board;
  },

  async updateBoard(uuid, payload) {
    const { name, description, status } = payload;
    const board = await prisma.board.findFirst({ where: { uuid } });
    if (!board) BaseService.throwError(404, "error.not_found");

    return prisma.board.update({
      where: { id: board.id },
      data: {
        ...(name ? { name } : {}),
        ...(description ? { description } : {}),
        ...(status ? { status } : {}),
      },
    });
  },

  async deleteBoard(uuid) {
    const board = await prisma.board.findFirst({ where: { uuid } });
    if (!board) BaseService.throwError(404, "error.not_found");
    await prisma.board.delete({ where: { id: board.id } });
  },

  async updateBoardStatus(uuid, status) {
    if (!status) BaseService.throwError(400, "validation.missing_fields");

    const board = await prisma.board.findFirst({ where: { uuid } });
    if (!board) BaseService.throwError(404, "error.not_found");

    return prisma.board.update({
      where: { id: board.id },
      data: { status },
    });
  },

  async getBoardLists(userId) {
    const board = await prisma.board.findUnique({ where: { id: Number(userId) } });
    if (!board) BaseService.throwError(404, "error.not_found");
    return board;
  },
};
