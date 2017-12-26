import Service from '../models/service';
import * as cacheController from '../controllers/cacheController';

export const find = async (criteria) => {

	try {

    	return await Service.find(criteria);

    } catch(err) {
  		throw err;
  	}
};

export const findOne = async (criteria) => {

	try {

		  const condition = Service.where(criteria);

    	return await Service.findOne(condition);
	    
  	} catch(err) {
    	throw err;
  	}

};

export const create = async (newService) => {

	try {

		const service = new Service(newService),
    result = await service.save();

    cacheController.setCacheValue(result.api + " " + result.method, result.permissions);

    return result;

	} catch(err) {
  		throw err;
  	}
};

export const findById = async (id) => {

	try {

		return await Service.findById(id);

	} catch(err) {
  		throw err;
  	}

};

export const update = async (id, body) => {

	try {

    	await Service.findByIdAndUpdate(id, { $set: body});

      cacheController.setCacheValue(body.api + " " + body.method, body.permissions);

      return result;
	    
  	} catch(err) {
  		throw err;
  	}

};

export const remove = async (id) => {

	try {

      const service = await findById(id);

      await service.remove();

      cacheController.deleteCacheValue(service.api + " " + service.method);

  	} catch(err) {
    	throw err;
  	}

};

export const deleteServicePermission = async (permissionId) => {

  try {

      let services = await find({permissions: { $elemMatch: { $in: [permissionId]} }});

      services.forEach((service) => {

        service.permissions.splice(service.permissions.indexOf(permissionId), 1);

        update(service._id, service);

        cacheController.setCacheValue(service.api + " " + service.method, service.permissions);

      });
      
    } catch(err) {
      throw err;
    }

};