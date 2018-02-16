import Service from '../models/service';
import * as cacheController from './cacheController';

export default class ServiceController {

  async find(criteria, isNotPaginated) {

    try {

      if (isNotPaginated) {
        return await Service.find(criteria);
      } else {
        const pagination = {
          page: Number(criteria.page),
          limit: Number(criteria.limit)
        };

        delete criteria.page;
        delete criteria.limit;

        return await Service.paginate(criteria, pagination);
      }

    } catch (err) {
      throw err;
    }
  }

  async findOne(criteria) {

    try {

      const condition = Service.where(criteria);

      return await Service.findOne(condition);

    } catch (err) {
      throw err;
    }

  }

  async create(newService) {

    try {

      const service = new Service(newService),
        result = await service.save();

      cacheController.setCacheValue(result.api + " " + result.method, result.permissions);

      return result;

    } catch (err) {
      throw err;
    }
  }

  async findById(id) {

    try {

      return await Service.findById(id).populate('permissions');

    } catch (err) {
      throw err;
    }

  }

  async update(id, body) {

    try {

      const result = await Service.findByIdAndUpdate(id, {
        $set: body
      });

      cacheController.setCacheValue(body.api + " " + body.method, body.permissions);

      return result;

    } catch (err) {
      throw err;
    }

  }

  async remove(id) {

    try {

      const service = await findById(id);

      await service.remove();

      cacheController.deleteCacheValue(service.api + " " + service.method);

    } catch (err) {
      throw err;
    }

  }

  async deleteServicePermission(permissionId) {

    try {

      let services = await this.find({
        permissions: {
          $elemMatch: {
            $in: [permissionId]
          }
        }
      }, true);

      services.forEach((service) => {

        service.permissions.splice(service.permissions.indexOf(permissionId), 1);

        this.update(service._id, service);

        cacheController.setCacheValue(service.api + " " + service.method, service.permissions);

      });

    } catch (err) {
      throw err;
    }

  }

}