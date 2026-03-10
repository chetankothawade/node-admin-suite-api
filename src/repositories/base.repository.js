export class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  findByPk(id, options = {}) {
    return this.model.findByPk(id, options);
  }

  findOne(options = {}) {
    return this.model.findOne(options);
  }

  findAll(options = {}) {
    return this.model.findAll(options);
  }

  findAndCountAll(options = {}) {
    return this.model.findAndCountAll(options);
  }

  create(payload, options = {}) {
    return this.model.create(payload, options);
  }
}


