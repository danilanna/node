import mongoose from 'mongoose';
import {getConfigurations} from '../config/config';
import User from '../app/models/user';
import Permission from '../app/models/permission';
import Service from '../app/models/service';
import * as cacheController from '../app/controllers/cacheController';

let newUser, varys;

export const clear = () => {
    return new Promise((success, reject) => {
        const config = getConfigurations(process.env.ENVIRONMENT);
        mongoose.Promise = global.Promise;
        mongoose.connect(config.database, { useMongoClient: true }, () => {
            mongoose.connection.db.dropDatabase();
            success();
        });
    });
}

export const getData = () => {
    return {
        newUser, varys
    };
}

export const create = () => {

    return new Promise((success, reject) => {

        clear().then(() => {

            let user = {
                name: "Tywin",
                password: "password",
                email: 't@got.com',
                admin: true
            };

            let userVarys = {
                name: "Varys",
                password: "password",
                email: 'v@got.com'
            };

            let permissionCrud = {
                name: "All USER CRUD",
                description: "All CRUD"
            };

            let userServiceFindAll = {
                api: "/api/users",
                description: "GET"
            };

            let userServiceRead = {
                api: "/api/users/:id",
                description: "GET"
            };

            let userServicePOST = {
                api: "/api/users",
                description: "POST"
            };

            let userServicePUT = {
                api: "/api/users/:id",
                description: "PUT"
            };

            let userServiceDELETE = {
                api: "/api/users/:id",
                description: "DELETE"
            };

            //Permission configuration
            let perm = new Permission(permissionCrud);
            perm.save();
            //end

            //user Service Permission configuration
            userServiceFindAll.permissions = [perm._id];
            userServiceRead.permissions = [perm._id];
            userServicePOST.permissions = [perm._id];
            userServicePUT.permissions = [perm._id];
            userServiceDELETE.permissions = [perm._id];

            let userServGetFind = new Service(userServiceFindAll);
            let userServGetRead = new Service(userServiceRead);
            let userServPost = new Service(userServicePOST);
            let userServPut = new Service(userServicePUT);
            let userServDel = new Service(userServiceDELETE);

            userServGetFind.save();
            userServGetRead.save();
            userServPost.save();
            userServPut.save();
            userServDel.save();

            cacheController.setCacheValue('/api/users GET', [perm._id.toString()]);
            cacheController.setCacheValue('/api/users/:id GET', [perm._id.toString()]);
            cacheController.setCacheValue('/api/users/:id PUT', [perm._id.toString()]);
            cacheController.setCacheValue('/api/users POST', [perm._id.toString()]);
            cacheController.setCacheValue('/api/users/:id DELETE', [perm._id.toString()]);
            //end

            //User default
            user.permissions = [perm._id];
            userVarys.permissions = [perm._id];

            newUser = new User(user);

            varys = new User(userVarys);

            newUser.save();
            varys.save();

            success();
        });
    });
}