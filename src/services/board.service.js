import { Op } from "sequelize";
import db from "../models/index.js";
import { BaseService } from "./base.service.js";
import { getPaginationParams, buildPaginationMeta } from "./pagination.service.js";

const { Board, User, List, ActivityLog } = db;

export const boardService = {
  async listBoards(query) {
    const { page, limit, offset, sortedField, sortedBy } = getPaginationParams(query);
    const search = query.search || "";

    const whereClause = {
      ...(search && {
        [Op.or]: [{ name: { [Op.like]: `%${search}%` } }, { description: { [Op.like]: `%${search}%` } }],
      }),
    };

    const { count, rows } = await Board.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [[sortedField, sortedBy]],
      include: [
        { model: User, as: "creator", attributes: ["id", "name", "email"] },
        { model: List, as: "lists", attributes: ["id", "title"] },
      ],
    });

    return { boards: rows, pagination: buildPaginationMeta(count || 0, page, limit) };
  },

  async createBoard(payload, user) {
    const { name, description } = payload;
    const createdBy = user?.id || payload.createdBy;
    if (!name || !createdBy) {
      BaseService.throwError(400, "validation.missing_fields");
    }
    return Board.create({ name, description, createdBy });
  },

  async getBoard(uuid) {
    const board = await Board.findOne({
      where: { uuid },
      include: [
        { model: User, as: "creator", attributes: ["id", "name", "email"] },
        { model: List, as: "lists", attributes: ["id", "title", "position"] },
        { model: ActivityLog, as: "activityLogs", attributes: ["id", "action", "createdAt"] },
      ],
    });
    if (!board) BaseService.throwError(404, "error.not_found");
    return board;
  },

  async updateBoard(uuid, payload) {
    const { name, description, status } = payload;
    const board = await Board.findOne({ where: { uuid } });
    if (!board) BaseService.throwError(404, "error.not_found");

    board.name = name || board.name;
    board.description = description || board.description;
    if (status) board.status = status;
    await board.save();
    return board;
  },

  async deleteBoard(uuid) {
    const board = await Board.findOne({ where: { uuid } });
    if (!board) BaseService.throwError(404, "error.not_found");
    await board.destroy();
  },

  async updateBoardStatus(uuid, status) {
    if (!status) BaseService.throwError(400, "validation.missing_fields");

    const board = await Board.findOne({ where: { uuid } });
    if (!board) BaseService.throwError(404, "error.not_found");

    board.status = status;
    await board.save();
    return board;
  },

  async getBoardLists(userId) {
    const board = await Board.findByPk(userId);
    if (!board) BaseService.throwError(404, "error.not_found");
    return board;
  },
};
