import Service from '../models/service';
import * as cacheController from './cacheController';
import GenericController from './genericController';

export default class ServiceController extends GenericController {
  constructor() {
    super(Service, 'permissions');
  }

  async create(newService) {
    try {
      const service = new Service(newService);
      const result = await service.save();

      await cacheController.setCacheValue(`${result.api} ${result.method}`, newService.permissions);

      return result;
    } catch (err) {
      throw err;
    }
  }

  async update(id, body) {
    try {
      const service = super.findById(id);

      const result = await Service.findByIdAndUpdate(id, {
        $set: body,
      });

      await cacheController.deleteCacheValue(`${service.api} ${service.method}`);

      await cacheController.setCacheValue(`${body.api} ${body.method}`, body.permissions);

      return result;
    } catch (err) {
      throw err;
    }
  }

  async remove(id) {
    try {
      const service = await super.findById(id);

      await service.remove();

      await cacheController.deleteCacheValue(`${service.api} ${service.method}`);
    } catch (err) {
      throw err;
    }
  }

  async deleteServicePermission(permissionId) {
    try {
      const services = await super.find({
        permissions: {
          $elemMatch: {
            $in: [permissionId],
          },
        },
      }, true);

      services.forEach(async (service) => {
        service.permissions.splice(service.permissions.indexOf(permissionId), 1);

        await this.update(service._id, service);

        await cacheController.setCacheValue(`${service.api} ${service.method}`, service.permissions);
      });
    } catch (err) {
      throw err;
    }
  }
}
