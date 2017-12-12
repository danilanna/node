import express from 'express';
import expressPermission from 'express-jwt-permissions';
import {find, create, findById, update, remove} from '../controllers/userController';
import * as permissionController from '../controllers/serviceController';

let guard = expressPermission({
    requestProperty: 'user',
    permissionsProperty: 'user.permissions'
  }),
  routes = express.Router(),
  getUsersPermissions = permissionController.findOne({api: "/api/users", method: "get"}),
  createUserPermissions = permissionController.findOne({api: "/api/users", method: "post"}),
  getUserPermissions = permissionController.findOne({api: "/api/users/:id", method: "get"}),
  updateUserPermissions = permissionController.findOne({api: "/api/users/:id", method: "put"}),
  deleteUserPermissions = permissionController.findOne({api: "/api/users/:id", method: "delete"});

getUsersPermissions.then((service) => {

  console.log(service);

  routes.get('/api/users', guard.check(service.permissions), async (req, res) => {

  try {

      const users = await find(req.query);

      res.json(users);
      
    } catch(err) {
      res.status(500).json({ success: false });
    }

  });

});

createUserPermissions.then((service) => {

  console.log(service);

  routes.post('/api/users', guard.check(service.permissions), async (req, res) => {

  	try {

      	const user = await create(req.body);

      	res.json({ success: true, user: user });
  	    
    	} catch(err) {
      	res.status(500).json({ success: false });
    	}

  });

});

getUserPermissions.then((service) => {

  console.log(service);

  routes.get('/api/users/:id', guard.check(service.permissions), async (req, res) => {

  	try {

      	const users = await findById(req.params.id);

      	res.json(users);
  	    
    	} catch(err) {
      	res.status(500).json({ success: false });
    	}

  });

});

updateUserPermissions.then((service) => {

  console.log(service);

  routes.put('/api/users/:id', guard.check(service.permissions), async (req, res) => {

  	try {

      	await update(req.params.id, req.body);

      	res.json({ success: true });
  	    
    	} catch(err) {
      	res.status(500).json({ success: false });
    	}

  });

});

deleteUserPermissions.then((service) => {

  console.log(service);

  routes.delete('/api/users/:id', guard.check(service.permissions), async (req, res) => {

  	try {

      	await remove(req.params.id);

      	res.json({ success: true });
  	    
    	} catch(err) {
      	res.status(500).json({ success: false });
    	}

  });

});

export default routes;