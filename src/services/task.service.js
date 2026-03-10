import { taskRepository } from "../repositories/task.repository.js";
import { BaseService } from "./base.service.js";
import { getPaginationParams, buildPaginationMeta } from "./pagination.service.js";

export const taskService = {
  async listTasks(query) {
    const { page, limit, offset, sorted_field, sorted_by } = getPaginationParams(query);
    const search = query.search || "";
    const list_id = query.list_id ? Number(query.list_id) : null;

    const whereClause = {
      ...(search && {
        OR: [{ title: { contains: search } }, { description: { contains: search } }],
      }),
      ...(list_id && { list_id }),
    };

    const [count, rows] = await Promise.all([
      taskRepository.count(whereClause),
      taskRepository.findMany({
        where: whereClause,
        take: limit,
        skip: offset,
        orderBy: { [sorted_field]: sorted_by.toLowerCase() },
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
    const { list_id, title, description, due_date, priority, assigned_to, tags, position } = payload;
    if (!list_id || !title) BaseService.throwError(400, "validation.missing_fields");

    return taskRepository.create({
        list_id: Number(list_id),
        title,
        description,
        due_date: due_date ? new Date(due_date) : null,
        priority,
        assigned_to: assigned_to ? Number(assigned_to) : null,
        tags,
        position,
        created_by: user?.id || null,
    });
  },

  async updateTask(uuid, payload) {
    const task = await taskRepository.findByUuid(uuid);
    if (!task) BaseService.throwError(404, "error.not_found");

    const data = {
      ...payload,
      ...(payload.list_id !== undefined ? { list_id: Number(payload.list_id) } : {}),
      ...(payload.created_by !== undefined ? { created_by: Number(payload.created_by) } : {}),
      ...(payload.assigned_to !== undefined ? { assigned_to: payload.assigned_to ? Number(payload.assigned_to) : null } : {}),
      ...(payload.due_date !== undefined ? { due_date: payload.due_date ? new Date(payload.due_date) : null } : {}),
    };

    return taskRepository.updateById(task.id, data);
  },

  async deleteTask(uuid) {
    const task = await taskRepository.findByUuid(uuid);
    if (!task) BaseService.throwError(404, "error.not_found");
    await taskRepository.deleteById(task.id);
  },

  async getTask(uuid) {
    const task = await taskRepository.findByUuid(uuid, {
        list: { select: { id: true, name: true } },
        creator: { select: { id: true, name: true, email: true } },
        assignee: { select: { id: true, name: true, email: true } },
        comments: true,
        attachments: true,
        activity_logs: true,
    });

    if (!task) BaseService.throwError(404, "error.not_found");
    return task;
  },

  async updateTaskStatus(uuid, status) {
    if (!status) BaseService.throwError(400, "validation.missing_fields");

    const task = await taskRepository.findByUuid(uuid);
    if (!task) BaseService.throwError(404, "error.not_found");

    return taskRepository.updateById(task.id, { status });
  },

  async getTaskList(board_id) {
    const board = await taskRepository.findBoardById(Number(board_id), {
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
    });

    if (!board) BaseService.throwError(404, "error.not_found");
    return board;
  },

  async updateTaskList(payload) {
    const { task_id, list_id } = payload;
    if (!task_id || !list_id) BaseService.throwError(400, "validation.missing_fields");

    const task = await taskRepository.findById(Number(task_id));
    if (!task) BaseService.throwError(404, "error.not_found");

    return taskRepository.updateById(Number(task_id), { list_id: Number(list_id) });
  },
};


