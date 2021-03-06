import Permission from '../models/permission';
import UserController from './userController';
import ServiceController from './serviceController';
import GenericController from './genericController';

const serviceController = new ServiceController();
const userController = new UserController();

export default class PermissionsController extends GenericController {
  constructor() {
    super(Permission);
  }

  async remove(id) {
    try {
      // If is deleting a permission, also delete it from users and services model.

      // When the token expires, the newly generated token will contain the updated permissions.
      await userController.deleteUserPermission(id);

      // Removes the service permissions and update the cache value
      await serviceController.deleteServicePermission(id);

      return await Permission.findByIdAndRemove(id);
    } catch (err) {
      throw err;
    }
  }
}
