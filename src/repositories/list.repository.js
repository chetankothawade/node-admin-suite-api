import db from "../models/index.js";
import { BaseRepository } from "./base.repository.js";

const { List } = db;

class ListRepository extends BaseRepository {
  constructor() {
    super(List);
  }
}

export const listRepository = new ListRepository();
