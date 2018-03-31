import ServiceController from '../controllers/serviceController';
import {getConfigurations} from '../../config/config';
import redis from 'redis';
import Promise from 'bluebird';

const config = getConfigurations(process.env.ENVIRONMENT);

const client = Promise.promisifyAll(redis.createClient(config.redis_port, config.redis_db, {no_ready_check: true}));

client.auth(config.redis_pw);

const serviceController = new ServiceController();

let promise;

export const setInitialCache = async () => {

	try {

		promise = await new Promise(async (success, reject) => {

			await client.flushall();

			const services = await serviceController.find({}, true);

			services.forEach(async (val) => {
				client.set(val.api + " " + val.method, val.permissions.toString());
			});
			
			success();
			
		});

		return await promise;

    } catch(err) {
  		throw err;
  	}
};

export const getCacheValue = async (val) => {
	return await client.getAsync(val).then((res) => {
	    return res && res.length > 0 ? res.split(',') : [];
	});
}

export const setCacheValue = async (key, val) => {
	if ( !val || ( val && val.length === 0 ) ) {
		await deleteCacheValue(key);
		return;
	} else {
		await client.set(key.toString(), val.toString());
	}
}

export const deleteCacheValue = async (key) => {
	await client.del(key.toString());
}