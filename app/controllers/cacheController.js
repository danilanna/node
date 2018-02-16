import LRU from 'lru-cache';
import * as serviceController from '../controllers/serviceController';

let options = { max: 500,
				maxAge: 86400000,
				length: (n, key) => { return n * 2 + key.length }
			},
  	cache = LRU(options),
  	promise;

export const setInitialCache = async () => {

	try {

		if(promise){
			return promise;
		}

		promise = new Promise((success, reject) => {

			if(cache.values().length === 0) {

				serviceController.find({}, true).then((services) => {

					services.forEach((val) => {
						setCacheValue(val.api + " " + val.method, val.permissions);
					})
					success();
				});
			}
		});

		return promise;

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