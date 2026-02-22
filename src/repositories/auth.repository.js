import db from "../models/index.js";
import { BaseRepository } from "./base.repository.js";

const { User } = db;

class AuthRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  findByEmail(email, options = {}) {
    return this.findOne({ where: { email }, ...options });
  }
}

export const authRepository = new AuthRepository();
