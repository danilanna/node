import express from 'express';
import UserController from '../controllers/userController';
import {checkPermission} from '../middlewares/middlewares';

let routes = express.Router();

const userController = new UserController();

routes.get('/api/users', checkPermission, async (req, res) => {

try {

    const users = await userController.find(req.query);

    res.json(users);
    
  } catch(err) {
    res.status(500).json({ success: false });
  }

});

routes.post('/api/users', checkPermission, async (req, res) => {

	try {

    	const user = await userController.create(req.body);

    	res.json({ success: true, user: user });
	    
  	} catch(err) {
    	res.status(500).json({ success: false });
  	}

});

routes.get('/api/users/:id', checkPermission, async (req, res) => {

	try {

    	const users = await userController.findById(req.params.id);

    	res.json(users);
	    
  	} catch(err) {
    	res.status(500).json({ success: false });
  	}

});

routes.put('/api/users/:id', checkPermission, async (req, res) => {

	try {

    	await userController.update(req.params.id, req.body);

    	res.json({ success: true });
	    
  	} catch(err) {
    	res.status(500).json({ success: false });
  	}

});

routes.delete('/api/users/:id', checkPermission, async (req, res) => {

	try {

    	await userController.remove(req.params.id);

    	res.json({ success: true });
	    
  	} catch(err) {
    	res.status(500).json({ success: false });
  	}

});

export default routes;