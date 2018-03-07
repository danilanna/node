import mongoose from 'mongoose';
import {getConfigurations} from '../config/config';
import User from '../app/models/user';
import Permission from '../app/models/permission';
import Service from '../app/models/service';
import * as cacheController from '../app/controllers/cacheController';

let newUser, permission;

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
        newUser, permission
    };
}

export const create = () => {

    return new Promise((success, reject) => {

        clear().then(() => {

            let user = {
                name: "Khal",
                password: "password",
                email: 'kdrogo@got.com'
            };

            let permissionCrud = {
                name: "All SERVICE CRUD",
                description: "All CRUD"
            };

            let serviceFindAll = {
                api: "/api/services",
                method: "GET"
            };

            let serviceRead = {
                api: "/api/services/:id",
                method: "GET"
            };

            let servicePOST = {
                api: "/api/services",
                method: "POST"
            };

            let servicePUT = {
                api: "/api/services/:id",
                method: "PUT"
            };

            let serviceDELETE = {
                api: "/api/services/:id",
                method: "DELETE"
            };

            //Permission configuration
            permission = new Permission(permissionCrud);
            permission.save();
            //end

            //user Service Permission configuration
            serviceFindAll.permissions = [permission._id];
            serviceRead.permissions = [permission._id];
            servicePOST.permissions = [permission._id];
            servicePUT.permissions = [permission._id];
            serviceDELETE.permissions = [permission._id];

            let servGetFind = new Service(serviceFindAll);
            let servGetRead = new Service(serviceRead);
            let servPost = new Service(servicePOST);
            let servPut = new Service(servicePUT);
            let servDel = new Service(serviceDELETE);

            servGetFind.save();
            servGetRead.save();
            servPost.save();
            servPut.save();
            servDel.save();

            cacheController.setCacheValue('/api/services GET', [permission._id.toString()]);
            cacheController.setCacheValue('/api/services/:id GET', [permission._id.toString()]);
            cacheController.setCacheValue('/api/services/:id PUT', [permission._id.toString()]);
            cacheController.setCacheValue('/api/services POST', [permission._id.toString()]);
            cacheController.setCacheValue('/api/services/:id DELETE', [permission._id.toString()]);
            //end

            //User default
            user.permissions = [permission._id];

            newUser = new User(user);

            newUser.save();

            success();
        });
    });
}