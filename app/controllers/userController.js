import User from '../models/user';

export default class UserController {

  constructor() {}

  async find(criteria, isNotPaginated) {

    try {

      if (isNotPaginated) {
        return await User.find(criteria);
      } else {
        const pagination = {
          page: Number(criteria.page),
          limit: Number(criteria.limit)
        };

        delete criteria.page;
        delete criteria.limit;

        return await User.paginate(criteria, pagination);
      }

    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  async findOne(criteria) {

    try {

      const condition = User.where(criteria);

      return await User.findOne(condition);

    } catch (err) {
      throw err;
    }

  };

  async create(newUser) {

    try {

      const user = new User(newUser);

      return await user.save();

    } catch (err) {
      throw err;
    }
  };

  async findById(id) {

    try {

      return await User.findById(id).populate('permissions');

    } catch (err) {
      throw err;
    }

  };

  async update(id, body) {

    try {

      return await User.findByIdAndUpdate(id, {
        $set: body
      });

    } catch (err) {
      throw err;
    }

  };

  async remove(id) {

    try {

      return await User.findByIdAndRemove(id);

    } catch (err) {
      throw err;
    }

  };

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