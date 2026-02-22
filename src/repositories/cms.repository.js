import db from "../models/index.js";
import { BaseRepository } from "./base.repository.js";

const { CMS } = db;

class CmsRepository extends BaseRepository {
  constructor() {
    super(CMS);
  }
}

export const cmsRepository = new CmsRepository();
