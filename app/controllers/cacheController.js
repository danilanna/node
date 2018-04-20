import redis from 'redis';
import Promise from 'bluebird';
import _ from 'lodash';
import ServiceController from '../controllers/serviceController';
import getConfigurations from '../../config/config';

const config = getConfigurations(process.env.ENVIRONMENT);
const target = redis.createClient(config.redis_port, config.redis_db, { no_ready_check: true });
const client = Promise.promisifyAll(target);
const serviceController = new ServiceController();

client.auth(config.redis_pw);

export const setInitialCache = async () => {
  try {
    const promise = await new Promise(async (success) => {
      await client.flushall();

      const services = await serviceController.find({}, true);

      services.forEach(async (val) => {
        client.setAsync(`${val.api} ${val.method}`, val.permissions.toString());
      });
      success();
    });

    return await promise;
  } catch (err) {
    throw err;
  }
};

export const deleteCacheValue = async (key) => {
  await client.delAsync(key.toString());
};

export const getCacheValue = async (val) => {
  const res = await client.getAsync(val);
  return res && res.length > 0 ? res.split(',') : [];
};

export const setCacheValue = async (key, val) => {
  if (!val || (val && val.length === 0)) {
    await deleteCacheValue(key);
    return;
  }
  await client.setAsync(key.toString(), _.map(val, '_id').toString());
};
