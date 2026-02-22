import db from "../models/index.js";
import { BaseRepository } from "./base.repository.js";

const { Module } = db;

class ModuleRepository extends BaseRepository {
  constructor() {
    super(Module);
  }
}

export const moduleRepository = new ModuleRepository();
