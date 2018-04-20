import mongoose from 'mongoose';
import getConfigurations from '../config/config';
import User from '../app/models/user';
import Permission from '../app/models/permission';
import Service from '../app/models/service';
import * as cacheController from '../app/controllers/cacheController';

let newUser;
let varys;

export const clear = async () => new Promise((success) => {
  const config = getConfigurations(process.env.ENVIRONMENT);
  mongoose.Promise = global.Promise;
  mongoose.connect(config.database, { useMongoClient: true }, () => {
    mongoose.connection.db.dropDatabase();
    success();
  });
});

export const getData = () => ({
  newUser, varys,
});

export const create = async () => new Promise(async (success) => {
  const user = {
    name: 'Tywin',
    password: 'password',
    email: 't@got.com',
    admin: true,
  };

  const userVarys = {
    name: 'Varys',
    password: 'password',
    email: 'v@got.com',
  };

  const permissionCrud = {
    name: 'All USER CRUD',
    description: 'All CRUD',
  };

  const userServiceFindAll = {
    api: '/api/users',
    description: 'GET',
  };

  const userServiceRead = {
    api: '/api/users/:id',
    description: 'GET',
  };

  const userServicePOST = {
    api: '/api/users',
    description: 'POST',
  };

  const userServicePUT = {
    api: '/api/users/:id',
    description: 'PUT',
  };

  const userServiceDELETE = {
    api: '/api/users/:id',
    description: 'DELETE',
  };

    // Permission configuration
  const perm = await new Permission(permissionCrud).save();
  // end

  // user Service Permission configuration
  userServiceFindAll.permissions = [perm._id];
  userServiceRead.permissions = [perm._id];
  userServicePOST.permissions = [perm._id];
  userServicePUT.permissions = [perm._id];
  userServiceDELETE.permissions = [perm._id];

  const userServGetFind = new Service(userServiceFindAll);
  const userServGetRead = new Service(userServiceRead);
  const userServPost = new Service(userServicePOST);
  const userServPut = new Service(userServicePUT);
  const userServDel = new Service(userServiceDELETE);

  await userServGetFind.save();
  await userServGetRead.save();
  await userServPost.save();
  await userServPut.save();
  await userServDel.save();

  cacheController.setCacheValue('/api/users GET', [{ _id: perm._id.toString() }]);
  cacheController.setCacheValue('/api/users/:id GET', [{ _id: perm._id.toString() }]);
  cacheController.setCacheValue('/api/users/:id PUT', [{ _id: perm._id.toString() }]);
  cacheController.setCacheValue('/api/users POST', [{ _id: perm._id.toString() }]);
  cacheController.setCacheValue('/api/users/:id DELETE', [{ _id: perm._id.toString() }]);
  // end

  // User default
  user.permissions = [perm._id];
  userVarys.permissions = [perm._id];

  newUser = await new User(user).save();

  varys = await new User(userVarys).save();

  success();
});
