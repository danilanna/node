import Service from '../models/service';
import * as cacheController from './cacheController';
import GenericController from './genericController';

export default class ServiceController extends GenericController {

  constructor() {
    super(Service, 'permissions');
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

      const service = await super.findById(id);

      await service.remove();

      cacheController.deleteCacheValue(service.api + " " + service.method);

    } catch (err) {
      throw err;
    }

  }

  async deleteServicePermission(permissionId) {

    try {

      let services = await super.find({
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