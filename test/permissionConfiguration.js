import mongoose from 'mongoose';
import getConfigurations from '../config/config';
import User from '../app/models/user';
import Permission from '../app/models/permission';
import Service from '../app/models/service';
import * as cacheController from '../app/controllers/cacheController';

let newUser;
let newPermission;

export const clear = () => new Promise((success) => {
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

const createData = async () => {
  const user = {
    name: 'Little Finger',
    password: 'password',
    email: 'lfinger@got.com',
  };

  const permissionCrud = {
    name: 'All PERMISSION CRUD',
    description: 'All CRUD',
  };

  const permissionFindAll = {
    api: '/api/permissions',
    method: 'GET',
  };

  const permissionRead = {
    api: '/api/permissions/:id',
    method: 'GET',
  };

  const permissionPOST = {
    api: '/api/permissions',
    method: 'POST',
  };

  const permissionPUT = {
    api: '/api/permissions/:id',
    method: 'PUT',
  };

  const permissionDELETE = {
    api: '/api/permissions/:id',
    method: 'DELETE',
  };

  // Permission configuration
  newPermission = await new Permission(permissionCrud).save();
  // end

  // user Service Permission configuration
  permissionFindAll.permissions = [newPermission._id];
  permissionRead.permissions = [newPermission._id];
  permissionPOST.permissions = [newPermission._id];
  permissionPUT.permissions = [newPermission._id];
  permissionDELETE.permissions = [newPermission._id];

  const servGetFind = new Service(permissionFindAll);
  const servGetRead = new Service(permissionRead);
  const servPost = new Service(permissionPOST);
  const servPut = new Service(permissionPUT);
  const servDel = new Service(permissionDELETE);

  await servGetFind.save();
  await servGetRead.save();
  await servPost.save();
  await servPut.save();
  await servDel.save();

  cacheController.setCacheValue('/api/permissions GET', [{ _id: newPermission._id.toString() }]);
  cacheController.setCacheValue('/api/permissions/:id GET', [{ _id: newPermission._id.toString() }]);
  cacheController.setCacheValue('/api/permissions/:id PUT', [{ _id: newPermission._id.toString() }]);
  cacheController.setCacheValue('/api/permissions POST', [{ _id: newPermission._id.toString() }]);
  cacheController.setCacheValue('/api/permissions/:id DELETE', [{ _id: newPermission._id.toString() }]);
  // end

  // User default
  user.permissions = [newPermission._id];

  newUser = await new User(user).save();
};

export const create = async () => new Promise(async (success) => {
  await clear();

  await createData();

  success();
});
