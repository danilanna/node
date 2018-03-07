// import mongoose from 'mongoose';
// import {getConfigurations} from '../config/config';
// import User from '../app/models/user';
// import Permission from '../app/models/permission';
// import Service from '../app/models/service';
// import * as cacheController from '../app/controllers/cacheController';

// let newUser, permissionAllCrudModel;

// export const clear = () => {
//     return new Promise((success, reject) => {
//         const config = getConfigurations(process.env.ENVIRONMENT);
//         mongoose.Promise = global.Promise;
//         mongoose.connect(config.database, { useMongoClient: true }, () => {
//             mongoose.connection.db.dropDatabase();
//             success();
//         });
//     });
// }

// export const getData = () => {
// 	return {
// 		newUser, permissionAllCrudModel
// 	};
// }

// const createData = () => {

//     let permissionAllCrud = {
//         name: "All CRUD",
//         description: "All CRUD"
//     };

//     //Permission configuration
//     permissionAllCrudModel = new Permission(permissionAllCrud);
//     permissionAllCrudModel.save();

//     //UUUUSSSEEERRR

//     let user = {
//         name: "Tywin",
//         password: "password",
//         email: 't@got.com',
//         admin: true
//     };

//     let userVarys = {
//         name: "Varys",
//         password: "password",
//         email: 'v@got.com'
//     };

//     let permissionCrud = {
//         name: "All USER CRUD",
//         description: "All CRUD"
//     };

//     let userServiceFindAll = {
//         api: "/api/users",
//         description: "GET"
//     };

//     let userServiceRead = {
//         api: "/api/users/:id",
//         description: "GET"
//     };

//     let userServicePOST = {
//         api: "/api/users",
//         description: "POST"
//     };

//     let userServicePUT = {
//         api: "/api/users/:id",
//         description: "PUT"
//     };

//     let userServiceDELETE = {
//         api: "/api/users/:id",
//         description: "DELETE"
//     };

//     //user Service Permission configuration
//     userServiceFindAll.permissions = [permissionAllCrudModel._id];
//     userServiceRead.permissions = [permissionAllCrudModel._id];
//     userServicePOST.permissions = [permissionAllCrudModel._id];
//     userServicePUT.permissions = [permissionAllCrudModel._id];
//     userServiceDELETE.permissions = [permissionAllCrudModel._id];

//     let userServGetFind = new Service(userServiceFindAll);
//     let userServGetRead = new Service(userServiceRead);
//     let userServPost = new Service(userServicePOST);
//     let userServPut = new Service(userServicePUT);
//     let userServDel = new Service(userServiceDELETE);

//     userServGetFind.save();
//     userServGetRead.save();
//     userServPost.save();
//     userServPut.save();
//     userServDel.save();

//     cacheController.setCacheValue('/api/users GET', [permissionAllCrudModel._id.toString()]);
//     cacheController.setCacheValue('/api/users/:id GET', [permissionAllCrudModel._id.toString()]);
//     cacheController.setCacheValue('/api/users/:id PUT', [permissionAllCrudModel._id.toString()]);
//     cacheController.setCacheValue('/api/users POST', [permissionAllCrudModel._id.toString()]);
//     cacheController.setCacheValue('/api/users/:id DELETE', [permissionAllCrudModel._id.toString()]);
//     //end

//     //User default
//     user.permissions = [permissionAllCrudModel._id];
//     userVarys.permissions = [permissionAllCrudModel._id];

//     newUser = new User(user);

//     varys = new User(userVarys);

//     newUser.save();
//     varys.save();

//     //SERVIIIIICEEEEE

//     let serviceFindAll = {
//         api: "/api/services",
//         method: "GET"
//     };

//     let serviceRead = {
//         api: "/api/services/:id",
//         method: "GET"
//     };

//     let servicePOST = {
//         api: "/api/services",
//         method: "POST"
//     };

//     let servicePUT = {
//         api: "/api/services/:id",
//         method: "PUT"
//     };

//     let serviceDELETE = {
//         api: "/api/services/:id",
//         method: "DELETE"
//     };

//     //user Service Permission configuration
//     serviceFindAll.permissions = [permissionAllCrudModel._id];
//     serviceRead.permissions = [permissionAllCrudModel._id];
//     servicePOST.permissions = [permissionAllCrudModel._id];
//     servicePUT.permissions = [permissionAllCrudModel._id];
//     serviceDELETE.permissions = [permissionAllCrudModel._id];

//     let servGetFind = new Service(serviceFindAll);
//     let servGetRead = new Service(serviceRead);
//     let servPost = new Service(servicePOST);
//     let servPut = new Service(servicePUT);
//     let servDel = new Service(serviceDELETE);

//     servGetFind.save();
//     servGetRead.save();
//     servPost.save();
//     servPut.save();
//     servDel.save();

//     cacheController.setCacheValue('/api/services GET', [permissionAllCrudModel._id.toString()]);
//     cacheController.setCacheValue('/api/services/:id GET', [permissionAllCrudModel._id.toString()]);
//     cacheController.setCacheValue('/api/services/:id PUT', [permissionAllCrudModel._id.toString()]);
//     cacheController.setCacheValue('/api/services POST', [permissionAllCrudModel._id.toString()]);
//     cacheController.setCacheValue('/api/services/:id DELETE', [permissionAllCrudModel._id.toString()]);

//     let permissionFindAll = {
//         api: "/api/permissions",
//         method: "GET"
//     };

//     let permissionRead = {
//         api: "/api/permissions/:id",
//         method: "GET"
//     };

//     let permissionPOST = {
//         api: "/api/permissions",
//         method: "POST"
//     };

//     let permissionPUT = {
//         api: "/api/permissions/:id",
//         method: "PUT"
//     };

//     let permissionDELETE = {
//         api: "/api/permissions/:id",
//         method: "DELETE"
//     };

//     //Permission configuration
//     permission = new Permission(permissionCrud);
//     permission.save();
//     //end

//     //user Service Permission configuration
//     permissionFindAll.permissions = [permissionAllCrudModel._id];
//     permissionRead.permissions = [permissionAllCrudModel._id];
//     permissionPOST.permissions = [permissionAllCrudModel._id];
//     permissionPUT.permissions = [permissionAllCrudModel._id];
//     permissionDELETE.permissions = [permissionAllCrudModel._id];

//     let servGetFind = new Service(permissionFindAll);
//     let servGetRead = new Service(permissionRead);
//     let servPost = new Service(permissionPOST);
//     let servPut = new Service(permissionPUT);
//     let servDel = new Service(permissionDELETE);

//     servGetFind.save();
//     servGetRead.save();
//     servPost.save();
//     servPut.save();
//     servDel.save();

//     cacheController.setCacheValue('/api/permissions GET', [permissionAllCrudModel._id.toString()]);
//     cacheController.setCacheValue('/api/permissions/:id GET', [permissionAllCrudModel._id.toString()]);
//     cacheController.setCacheValue('/api/permissions/:id PUT', [permissionAllCrudModel._id.toString()]);
//     cacheController.setCacheValue('/api/permissions POST', [permissionAllCrudModel._id.toString()]);
//     cacheController.setCacheValue('/api/permissions/:id DELETE', [permissionAllCrudModel._id.toString()]);
//     //end

// }

// export const create = () => {

//     return new Promise((success, reject) => {

//         clear().then(() => {

//             createData();
//             success();
                    
//         });
//     });
// }