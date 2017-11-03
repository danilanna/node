import User from '../models/user';

export const find = async (criteria) => {

	try {

    	return await User.find(criteria);

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

		return await User.findById(id);

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