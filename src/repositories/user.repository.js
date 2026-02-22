import { Op } from "sequelize";
import db from "../models/index.js";
import { BaseRepository } from "./base.repository.js";

const { User } = db;

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  findByUuid(uuid, attributes = undefined) {
    return this.findOne({
      where: { uuid },
      ...(attributes ? { attributes } : {}),
    });
  }

  findByEmail(email) {
    return this.findOne({ where: { email } });
  }

  findByEmailExcludingId(email, excludedUserId) {
    return this.findOne({
      where: {
        email,
        id: { [Op.ne]: excludedUserId },
      },
    });
  }

  listUsers({ where, attributes, limit, offset, order }) {
    return this.findAndCountAll({ where, attributes, limit, offset, order });
  }

  listAdmins(attributes) {
    return this.findAll({
      where: { role: "admin", status: { [Op.ne]: "suspended" } },
      attributes,
    });
  }

  listForCsv(attributes) {
    return this.findAll({
      attributes,
      where: { status: { [Op.ne]: "suspended" } },
      order: [["createdAt", "DESC"]],
    });
  }
}

export const userRepository = new UserRepository();
