import { Op } from "sequelize";
import db from "../models/index.js";
import { BaseService } from "./base.service.js";
import { getPaginationParams, buildPaginationMeta } from "./pagination.service.js";

const { Task, List, User, Comment, Attachment, ActivityLog, Board } = db;

export const taskService = {
  async listTasks(query) {
    const { page, limit, offset, sortedField, sortedBy } = getPaginationParams(query);
    const search = query.search || "";
    const listId = query.listId || null;

    const whereClause = {
      ...(search && {
        [Op.or]: [
          { title: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
        ],
      }),
      ...(listId && { listId }),
    };

    const { count, rows } = await Task.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [[sortedField, sortedBy]],
      include: [
        { model: List, as: "list", attributes: ["id", "title"] },
        { model: User, as: "creator", attributes: ["id", "name", "email"] },
        { model: User, as: "assignee", attributes: ["id", "name", "email"] },
      ],
    });

    return { tasks: rows, pagination: buildPaginationMeta(count || 0, page, limit) };
  },

  async createTask(payload, user) {
    const { listId, title, description, dueDate, priority, assignedTo, tags, position } = payload;
    if (!listId || !title) BaseService.throwError(400, "validation.missing_fields");

    return Task.create({
      listId,
      title,
      description,
      dueDate,
      priority,
      assignedTo,
      tags,
      position,
      createdBy: user?.id || null,
    });
  },

  async updateTask(uuid, payload) {
    const task = await Task.findOne({ where: { uuid } });
    if (!task) BaseService.throwError(404, "error.not_found");

    Object.assign(task, payload);
    await task.save();
    return task;
  },

  async deleteTask(uuid) {
    const task = await Task.findOne({ where: { uuid } });
    if (!task) BaseService.throwError(404, "error.not_found");
    await task.destroy();
  },

  async getTask(uuid) {
    const task = await Task.findOne({
      where: { uuid },
      include: [
        { model: List, as: "list", attributes: ["id", "title"] },
        { model: User, as: "creator", attributes: ["id", "name", "email"] },
        { model: User, as: "assignee", attributes: ["id", "name", "email"] },
        { model: Comment, as: "comments" },
        { model: Attachment, as: "attachments" },
        { model: ActivityLog, as: "activityLogs" },
      ],
    });
    if (!task) BaseService.throwError(404, "error.not_found");
    return task;
  },

  async updateTaskStatus(uuid, status) {
    if (!status) BaseService.throwError(400, "validation.missing_fields");

    const task = await Task.findOne({ where: { uuid } });
    if (!task) BaseService.throwError(404, "error.not_found");
    task.status = status;
    await task.save();
    return task;
  },

  async getTaskList(boardId) {
    const board = await Board.findOne({
      where: { id: boardId },
      include: [
        {
          model: List,
          as: "lists",
          include: [
            {
              model: Task,
              as: "tasks",
              include: [
                { model: User, as: "creator", attributes: ["id", "name", "email"] },
                { model: User, as: "assignee", attributes: ["id", "name", "email"] },
              ],
            },
          ],
        },
      ],
    });

    if (!board) BaseService.throwError(404, "error.not_found");
    return board;
  },

  async updateTaskList(payload) {
    const { taskId, listId } = payload;
    if (!taskId || !listId) BaseService.throwError(400, "validation.missing_fields");

    const task = await Task.findByPk(taskId);
    if (!task) BaseService.throwError(404, "error.not_found");

    task.listId = listId;
    await task.save();
    return task;
  },
};
