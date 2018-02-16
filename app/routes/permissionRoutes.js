import express from 'express';
import PermissionController from '../controllers/permissionController';
import {checkPermission} from '../middlewares/middlewares';

let routes = express.Router();

const permissionController = new PermissionController();

routes.get('/api/permissions', checkPermission, async (req, res) => {

  try {

      const permissions = await permissionController.find(req.query);

      res.json(permissions);
      
    } catch(err) {
      res.status(500).json({ success: false });
    }

});

routes.post('/api/permissions', checkPermission, async (req, res) => {

	try {

    	const user = await permissionController.create(req.body);

    	res.json({ success: true, user: user });
	    
  	} catch(err) {
    	res.status(500).json({ success: false });
  	}

});


routes.get('/api/permissions/:id', checkPermission, async (req, res) => {

	try {

    	const permissions = await permissionController.findById(req.params.id);

    	res.json(permissions);
	    
  	} catch(err) {
    	res.status(500).json({ success: false });
  	}

});


routes.put('/api/permissions/:id', checkPermission, async (req, res) => {

	try {

    	await permissionController.update(req.params.id, req.body);

    	res.json({ success: true });
	    
  	} catch(err) {
    	res.status(500).json({ success: false });
  	}

});

routes.delete('/api/permissions/:id', checkPermission, async (req, res) => {

	try {

    	await permissionController.remove(req.params.id);

    	res.json({ success: true });
	    
  	} catch(err) {
    	res.status(500).json({ success: false });
  	}

});

export default routes;