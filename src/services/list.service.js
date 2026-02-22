import { Op } from "sequelize";
import db from "../models/index.js";
import { BaseService } from "./base.service.js";
import { getPaginationParams, buildPaginationMeta } from "./pagination.service.js";

const { List, Board, Task, ActivityLog } = db;

export const listService = {
  async listLists(query) {
    const { page, limit, offset, sortedField, sortedBy } = getPaginationParams(query);
    const search = query.search || "";
    const boardId = query.boardId || null;

    const whereClause = {
      ...(boardId && { boardId }),
      ...(search && { name: { [Op.like]: `%${search}%` } }),
    };

    const { count, rows } = await List.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [[sortedField, sortedBy]],
      include: [
        { model: Board, as: "board", attributes: ["id", "name"] },
        { model: Task, as: "tasks", attributes: ["id", "title", "status"] },
      ],
    });

    return { lists: rows, pagination: buildPaginationMeta(count || 0, page, limit) };
  },

  async createList(payload) {
    const { boardId, name, position } = payload;
    if (!boardId || !name) BaseService.throwError(400, "validation.missing_fields");

    const board = await Board.findByPk(boardId);
    if (!board) BaseService.throwError(404, "error.board_not_found");

    return List.create({ boardId, name, position });
  },

  async getList(uuid) {
    const list = await List.findOne({
      where: { uuid },
      include: [
        { model: Board, as: "board", attributes: ["id", "name"] },
        { model: Task, as: "tasks", attributes: ["id", "title", "status", "position"] },
        { model: ActivityLog, as: "activityLogs", attributes: ["id", "action", "createdAt"] },
      ],
    });
    if (!list) BaseService.throwError(404, "error.not_found");
    return list;
  },

  async updateList(uuid, payload) {
    const { name, position } = payload;
    const list = await List.findOne({ where: { uuid } });
    if (!list) BaseService.throwError(404, "error.not_found");

    if (name) list.name = name;
    if (position !== undefined) list.position = position;
    await list.save();
    return list;
  },

  async deleteList(uuid) {
    const list = await List.findOne({ where: { uuid } });
    if (!list) BaseService.throwError(404, "error.not_found");
    await list.destroy();
  },
};
