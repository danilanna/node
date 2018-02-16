import User from '../models/user';
import GenericController from './genericController';

export default class UserController extends GenericController {

  constructor() {
    super(User, 'permissions');
  }

  async deleteUserPermission(permissionId) {

    try {

      let users = await this.find({
        permissions: {
          $elemMatch: {
            $in: [permissionId]
          }
        }
      }, true);

      users.forEach((user) => {

        user.permissions.splice(user.permissions.indexOf(permissionId), 1);

        return this.update(user._id, user);

      });

    } catch (err) {
      throw err;
    }
  };

}