import mongoose from 'mongoose';
import {getConfigurations} from '../config/config';
import User from '../app/models/user';
import Permission from '../app/models/permission';
import Service from '../app/models/service';
import * as cacheController from '../app/controllers/cacheController';

let newUser, permission;

export const clear = async () => {
    return await new Promise((success, reject) => {
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

const createData = async () => {

    let user = {
        name: "Little Finger",
        password: "password",
        email: 'lfinger@got.com'
    };

    let permissionCrud = {
        name: "All PERMISSION CRUD",
        description: "All CRUD"
    };

    let permissionFindAll = {
        api: "/api/permissions",
        method: "GET"
    };

    let permissionRead = {
        api: "/api/permissions/:id",
        method: "GET"
    };

    let permissionPOST = {
        api: "/api/permissions",
        method: "POST"
    };

    let permissionPUT = {
        api: "/api/permissions/:id",
        method: "PUT"
    };

    let permissionDELETE = {
        api: "/api/permissions/:id",
        method: "DELETE"
    };

    //Permission configuration
    permission = await new Permission(permissionCrud).save();
    //end

    //user Service Permission configuration
    permissionFindAll.permissions = [permission._id];
    permissionRead.permissions = [permission._id];
    permissionPOST.permissions = [permission._id];
    permissionPUT.permissions = [permission._id];
    permissionDELETE.permissions = [permission._id];

    let servGetFind = new Service(permissionFindAll);
    let servGetRead = new Service(permissionRead);
    let servPost = new Service(permissionPOST);
    let servPut = new Service(permissionPUT);
    let servDel = new Service(permissionDELETE);

    await servGetFind.save();
    await servGetRead.save();
    await servPost.save();
    await servPut.save();
    await servDel.save();

    cacheController.setCacheValue('/api/permissions GET', [permission._id.toString()]);
    cacheController.setCacheValue('/api/permissions/:id GET', [permission._id.toString()]);
    cacheController.setCacheValue('/api/permissions/:id PUT', [permission._id.toString()]);
    cacheController.setCacheValue('/api/permissions POST', [permission._id.toString()]);
    cacheController.setCacheValue('/api/permissions/:id DELETE', [permission._id.toString()]);
    //end

    //User default
    user.permissions = [permission._id];

    newUser = await new User(user).save();

}

export const create = async () => {

    return await new Promise(async (success, reject) => {

        await clear();

        await createData();

        success();

    });
}