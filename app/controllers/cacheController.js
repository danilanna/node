import LRU from 'lru-cache';
import ServiceController from '../controllers/serviceController';

const serviceController = new ServiceController();

let options = { max: 500,
				maxAge: 86400000,
				length: (n, key) => { return n * 2 + key.length }
			},
  	cache = LRU(options),
  	promise;

export const setInitialCache = async () => {

	try {

		promise = await new Promise(async (success, reject) => {
			
			if(cache.values().length === 0) {

				const services = await serviceController.find({}, true);

				services.forEach((val) => {
					setCacheValue(val.api + " " + val.method, val.permissions);
				})

				success();
			}
			
			success();
			
		});

		return await promise;

    } catch(err) {
  		throw err;
  	}
};

export const getCacheValue = (val) => {
	return cache.get(val) || "";
}

export const setCacheValue = (key, val) => {
	cache.set(key, val);
}

export const deleteCacheValue = (key) => {
	cache.del(key)
}