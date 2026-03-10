import prisma from "../lib/prisma.js";
import { BaseService } from "./base.service.js";
import { getPaginationParams, buildPaginationMeta } from "./pagination.service.js";

export const taskService = {
  async listTasks(query) {
    const { page, limit, offset, sortedField, sortedBy } = getPaginationParams(query);
    const search = query.search || "";
    const listId = query.listId ? Number(query.listId) : null;

    const whereClause = {
      ...(search && {
        OR: [{ title: { contains: search } }, { description: { contains: search } }],
      }),
      ...(listId && { listId }),
    };

    const [count, rows] = await Promise.all([
      prisma.task.count({ where: whereClause }),
      prisma.task.findMany({
        where: whereClause,
        take: limit,
        skip: offset,
        orderBy: { [sortedField]: sortedBy.toLowerCase() },
        include: {
          list: { select: { id: true, name: true } },
          creator: { select: { id: true, name: true, email: true } },
          assignee: { select: { id: true, name: true, email: true } },
        },
      }),
    ]);

    return { tasks: rows, pagination: buildPaginationMeta(count || 0, page, limit) };
  },

  async createTask(payload, user) {
    const { listId, title, description, dueDate, priority, assignedTo, tags, position } = payload;
    if (!listId || !title) BaseService.throwError(400, "validation.missing_fields");

    return prisma.task.create({
      data: {
        listId: Number(listId),
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority,
        assignedTo: assignedTo ? Number(assignedTo) : null,
        tags,
        position,
        createdBy: user?.id || null,
      },
    });
  },

  async updateTask(uuid, payload) {
    const task = await prisma.task.findFirst({ where: { uuid } });
    if (!task) BaseService.throwError(404, "error.not_found");

    const data = {
      ...payload,
      ...(payload.listId !== undefined ? { listId: Number(payload.listId) } : {}),
      ...(payload.createdBy !== undefined ? { createdBy: Number(payload.createdBy) } : {}),
      ...(payload.assignedTo !== undefined ? { assignedTo: payload.assignedTo ? Number(payload.assignedTo) : null } : {}),
      ...(payload.dueDate !== undefined ? { dueDate: payload.dueDate ? new Date(payload.dueDate) : null } : {}),
    };

    return prisma.task.update({
      where: { id: task.id },
      data,
    });
  },

  async deleteTask(uuid) {
    const task = await prisma.task.findFirst({ where: { uuid } });
    if (!task) BaseService.throwError(404, "error.not_found");
    await prisma.task.delete({ where: { id: task.id } });
  },

  async getTask(uuid) {
    const task = await prisma.task.findFirst({
      where: { uuid },
      include: {
        list: { select: { id: true, name: true } },
        creator: { select: { id: true, name: true, email: true } },
        assignee: { select: { id: true, name: true, email: true } },
        comments: true,
        attachments: true,
        activityLogs: true,
      },
    });

    if (!task) BaseService.throwError(404, "error.not_found");
    return task;
  },

  async updateTaskStatus(uuid, status) {
    if (!status) BaseService.throwError(400, "validation.missing_fields");

    const task = await prisma.task.findFirst({ where: { uuid } });
    if (!task) BaseService.throwError(404, "error.not_found");

    return prisma.task.update({
      where: { id: task.id },
      data: { status },
    });
  },

  async getTaskList(boardId) {
    const board = await prisma.board.findUnique({
      where: { id: Number(boardId) },
      include: {
        lists: {
          include: {
            tasks: {
              include: {
                creator: { select: { id: true, name: true, email: true } },
                assignee: { select: { id: true, name: true, email: true } },
              },
            },
          },
        },
      },
    });

    if (!board) BaseService.throwError(404, "error.not_found");
    return board;
  },

  async updateTaskList(payload) {
    const { taskId, listId } = payload;
    if (!taskId || !listId) BaseService.throwError(400, "validation.missing_fields");

    const task = await prisma.task.findUnique({ where: { id: Number(taskId) } });
    if (!task) BaseService.throwError(404, "error.not_found");

    return prisma.task.update({
      where: { id: Number(taskId) },
      data: { listId: Number(listId) },
    });
  },
};
