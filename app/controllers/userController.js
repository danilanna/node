import User from '../models/user';

export const find = async (criteria, isNotPaginated) => {

	try {

    if ( isNotPaginated ) {
      return await User.find(criteria);
    } else {
      const pagination = {page: Number(criteria.page), limit: Number(criteria.limit)};

      delete criteria.page;
      delete criteria.limit;

      return await User.paginate(criteria, pagination);
    }

    } catch(err) {
  		throw err;
  	}
};

export const findOne = async (criteria) => {

	try {

		const condition = User.where(criteria);

    	return await User.findOne(condition);
	    
  	} catch(err) {
    	throw err;
  	}

};

export const create = async (newUser) => {

	try {

		const user = new User(newUser);

		return await user.save();

	} catch(err) {
  		throw err;
  	}
};

export const findById = async (id) => {

	try {

		return await User.findById(id).populate('permissions');

	} catch(err) {
  		throw err;
  	}

};

export const update = async (id, body) => {

	try {

    	return await User.findByIdAndUpdate(id, { $set: body});
	    
  	} catch(err) {
  		throw err;
  	}

};

export const remove = async (id) => {

	try {

    	return await User.findByIdAndRemove(id);
	    
  	} catch(err) {
    	throw err;
  	}

};

export const deleteUserPermission = async (permissionId) => {

  try {

      let users = await find({permissions: { $elemMatch: { $in: [permissionId]} }}, true);

      users.forEach((user) => {

        user.permissions.splice(user.permissions.indexOf(permissionId), 1);

        return update(user._id, user);

      });
      
    } catch(err) {
      throw err;
    }

};