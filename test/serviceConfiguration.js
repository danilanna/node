import mongoose from 'mongoose';
import getConfigurations from '../config/config';
import User from '../app/models/user';
import Permission from '../app/models/permission';
import Service from '../app/models/service';
import * as cacheController from '../app/controllers/cacheController';

let newUser;
let newPermission;

export const clear = async () => new Promise((success) => {
  const config = getConfigurations(process.env.ENVIRONMENT);
  mongoose.Promise = global.Promise;
  mongoose.connect(config.database, { useMongoClient: true }, () => {
    mongoose.connection.db.dropDatabase();
    success();
  });
});

export const getData = () => ({
  newUser, newPermission,
});


export const create = async () => new Promise(async (success) => {
  await clear();

  const user = {
    name: 'Khal',
    password: 'password',
    email: 'kdrogo@got.com',
  };

  const permissionCrud = {
    name: 'All SERVICE CRUD',
    description: 'All CRUD',
  };

  const serviceFindAll = {
    api: '/api/services',
    method: 'GET',
  };

  const serviceRead = {
    api: '/api/services/:id',
    method: 'GET',
  };

  const servicePOST = {
    api: '/api/services',
    method: 'POST',
  };

  const servicePUT = {
    api: '/api/services/:id',
    method: 'PUT',
  };

  const serviceDELETE = {
    api: '/api/services/:id',
    method: 'DELETE',
  };

    // Permission configuration
  newPermission = await new Permission(permissionCrud).save();
  // end

  // user Service Permission configuration
  serviceFindAll.permissions = [newPermission._id];
  serviceRead.permissions = [newPermission._id];
  servicePOST.permissions = [newPermission._id];
  servicePUT.permissions = [newPermission._id];
  serviceDELETE.permissions = [newPermission._id];

  const servGetFind = new Service(serviceFindAll);
  const servGetRead = new Service(serviceRead);
  const servPost = new Service(servicePOST);
  const servPut = new Service(servicePUT);
  const servDel = new Service(serviceDELETE);

  await servGetFind.save();
  await servGetRead.save();
  await servPost.save();
  await servPut.save();
  await servDel.save();

  cacheController.setCacheValue('/api/services GET', [{ _id: newPermission._id.toString() }]);
  cacheController.setCacheValue('/api/services/:id GET', [{ _id: newPermission._id.toString() }]);
  cacheController.setCacheValue('/api/services/:id PUT', [{ _id: newPermission._id.toString() }]);
  cacheController.setCacheValue('/api/services POST', [{ _id: newPermission._id.toString() }]);
  cacheController.setCacheValue('/api/services/:id DELETE', [{ _id: newPermission._id.toString() }]);
  // end

  // User default
  user.permissions = [newPermission._id];

  newUser = await new User(user).save();

  success();
});
