import db from "../models/index.js";
import { BaseRepository } from "./base.repository.js";

const { Category } = db;

class CategoryRepository extends BaseRepository {
  constructor() {
    super(Category);
  }
}

export const categoryRepository = new CategoryRepository();
