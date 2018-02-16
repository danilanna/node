import Permission from '../models/permission';
import * as userController from '../controllers/userController';
import * as serviceController from '../controllers/serviceController';

export const find = async (criteria, isNotPaginated) => {

	try {

    if ( criteria !== undefined && criteria.page === undefined) {
      return await Permission.find(criteria);
    } else {
      const pagination = {page: Number(criteria.page), limit: Number(criteria.limit)};

      delete criteria.page;
      delete criteria.limit;

      return await Permission.paginate(criteria, pagination);
    }

  } catch(err) {
		throw err;
	}
};

export const findOne = async (criteria) => {

	try {

		  const condition = Permission.where(criteria);

    	return await Permission.findOne(condition);
	    
  	} catch(err) {
    	throw err;
  	}

};

export const create = (newPermission) => {

	try {

		const permission = new Permission(newPermission);

		return permission.save();

	} catch(err) {
  		throw err;
  	}
};

export const findById = async (id) => {

	try {

		return await Permission.findById(id);

	} catch(err) {
  		throw err;
	}

};

export const update = async (id, body) => {

	try {

    	return await Permission.findByIdAndUpdate(id, { $set: body});
	    
  	} catch(err) {
  		throw err;
  	}

};

export const remove = async (id) => {

	try {

      //Whether delete a permission, also delete it from users and services.

      //When the token expires, the newly generated token will contain the updated permissions.
      await userController.deleteUserPermission(id);

      //Removes the service permissions and update the cache value
      await serviceController.deleteServicePermission(id);

    	return await Permission.findByIdAndRemove(id);
	    
  	} catch(err) {
    	throw err;
  	}

};