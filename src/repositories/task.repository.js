import db from "../models/index.js";
import { BaseRepository } from "./base.repository.js";

const { Task } = db;

class TaskRepository extends BaseRepository {
  constructor() {
    super(Task);
  }
}

export const taskRepository = new TaskRepository();
