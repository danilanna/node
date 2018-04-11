import _ from 'lodash';

export default class GenericController {
  constructor(model, populate) {
    this.model = model;
    this.populate = populate;
  }

  async find(criteria, isNotPaginated) {
    try {
      if (isNotPaginated || (criteria !== undefined && criteria.page === undefined)) {
        return await this.model.find(criteria);
      }
      const pagination = {
        page: Number(criteria.page),
        limit: Number(criteria.limit),
      };

      const condition = _.omit(criteria, ['page', 'limit']);

      return await this.model.paginate(condition, pagination);
    } catch (err) {
      throw err;
    }
  }

  async findOne(criteria) {
    try {
      const condition = this.model.where(criteria);

      return await this.model.findOne(condition);
    } catch (err) {
      throw err;
    }
  }

  async create(newModel) {
    try {
      const model = new this.model(newModel);

      return await model.save();
    } catch (err) {
      throw err;
    }
  }

  async findById(id) {
    try {
      if (this.populate) {
        return await this.model.findById(id).populate(this.populate);
      }
      return await this.model.findById(id);
    } catch (err) {
      throw err;
    }
  }

  async update(id, body) {
    try {
      return await this.model.findByIdAndUpdate(id, {
        $set: body,
      });
    } catch (err) {
      throw err;
    }
  }

  async remove(id) {
    try {
      return await this.model.findByIdAndRemove(id);
    } catch (err) {
      throw err;
    }
  }
}
