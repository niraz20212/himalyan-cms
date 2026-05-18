const prisma = require('../config/db');

class BaseRepository {
  constructor(model) {
    this.model = prisma[model];
  }

  findMany(args = {}) {
    return this.model.findMany(args);
  }

  findUnique(args) {
    return this.model.findUnique(args);
  }

  create(args) {
    return this.model.create(args);
  }

  update(args) {
    return this.model.update(args);
  }
}

module.exports = BaseRepository;
