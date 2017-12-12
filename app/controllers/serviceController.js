import Service from '../models/service';

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

		const service = new Service(newService);

		return await service.save();

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

    	return await Service.findByIdAndUpdate(id, { $set: body});
	    
  	} catch(err) {
  		throw err;
  	}

};

export const remove = async (id) => {

	try {

    	return await Service.findByIdAndRemove(id);
	    
  	} catch(err) {
    	throw err;
  	}

};