import express from 'express';
import {find, create, findById, update, remove} from '../controllers/permissionController';
import {checkPermission} from '../middlewares/middlewares';

let routes = express.Router();

routes.get('/api/permissions', checkPermission, async (req, res) => {

  try {

      const permissions = await find(req.query);

      res.json(permissions);
      
    } catch(err) {
      res.status(500).json({ success: false });
    }

});

routes.post('/api/permissions', checkPermission, async (req, res) => {

	try {

    	const user = await create(req.body);

    	res.json({ success: true, user: user });
	    
  	} catch(err) {
    	res.status(500).json({ success: false });
  	}

});


routes.get('/api/permissions/:id', checkPermission, async (req, res) => {

	try {

    	const permissions = await findById(req.params.id);

    	res.json(permissions);
	    
  	} catch(err) {
    	res.status(500).json({ success: false });
  	}

});


routes.put('/api/permissions/:id', checkPermission, async (req, res) => {

	try {

    	await update(req.params.id, req.body);

    	res.json({ success: true });
	    
  	} catch(err) {
    	res.status(500).json({ success: false });
  	}

});

routes.delete('/api/permissions/:id', checkPermission, async (req, res) => {

	try {

    	await remove(req.params.id);

    	res.json({ success: true });
	    
  	} catch(err) {
    	res.status(500).json({ success: false });
  	}

});

export default routes;