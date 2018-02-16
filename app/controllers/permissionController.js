import Permission from '../models/permission';
import UserController from './userController';
import ServiceController from './serviceController';

const serviceController = new ServiceController(),
      userController = new UserController();

export default class PermissionsController {

  async find(criteria, isNotPaginated) {

    try {

      if (criteria !== undefined && criteria.page === undefined) {
        return await Permission.find(criteria);
      } else {
        const pagination = {
          page: Number(criteria.page),
          limit: Number(criteria.limit)
        };

        delete criteria.page;
        delete criteria.limit;

        return await Permission.paginate(criteria, pagination);
      }

    } catch (err) {
      throw err;
    }
  };

  async findOne(criteria) {

    try {

      const condition = Permission.where(criteria);

      return await Permission.findOne(condition);

    } catch (err) {
      throw err;
    }

  };

  async create(newPermission) {

    try {

      const permission = new Permission(newPermission);

      return permission.save();

    } catch (err) {
      throw err;
    }
  };

  async findById(id) {

    try {

      return await Permission.findById(id);

    } catch (err) {
      throw err;
    }

  };

  async update(id, body) {

    try {

      return await Permission.findByIdAndUpdate(id, {
        $set: body
      });

    } catch (err) {
      throw err;
    }

  };

  async remove(id) {

    try {

      //Whether delete a permission, also delete it from users and services.

      //When the token expires, the newly generated token will contain the updated permissions.
      await userController.deleteUserPermission(id);

      //Removes the service permissions and update the cache value
      await serviceController.deleteServicePermission(id);

      return await Permission.findByIdAndRemove(id);

    } catch (err) {
      console.log(err);
      throw err;
    }

  };

}