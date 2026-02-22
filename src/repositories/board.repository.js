import db from "../models/index.js";
import { BaseRepository } from "./base.repository.js";

const { Board } = db;

class BoardRepository extends BaseRepository {
  constructor() {
    super(Board);
  }
}

export const boardRepository = new BoardRepository();
