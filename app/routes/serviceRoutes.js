import express from 'express';
import {find, create, findById, update, remove} from '../controllers/serviceController';
import {checkPermission} from '../middlewares/middlewares';

let routes = express.Router();

routes.get('/api/services', checkPermission, async (req, res) => {

try {

    const services = await find(req.query);

    res.json(services);
    
  } catch(err) {
    res.status(500).json({ success: false });
  }

});

routes.post('/api/services', checkPermission, async (req, res) => {

	try {

    	const service = await create(req.body);

    	res.json({ success: true, service: service });
	    
  	} catch(err) {
    	res.status(500).json({ success: false });
  	}

});

routes.get('/api/services/:id', checkPermission, async (req, res) => {

	try {

    	const services = await findById(req.params.id);

    	res.json(services);
	    
  	} catch(err) {
    	res.status(500).json({ success: false });
  	}

});

routes.put('/api/services/:id', checkPermission, async (req, res) => {

	try {

    	await update(req.params.id, req.body);

    	res.json({ success: true });
	    
  	} catch(err) {
    	res.status(500).json({ success: false });
  	}

});

routes.delete('/api/services/:id', checkPermission, async (req, res) => {

	try {

    	await remove(req.params.id);

    	res.json({ success: true });
	    
  	} catch(err) {
    	res.status(500).json({ success: false });
  	}

});

export default routes;