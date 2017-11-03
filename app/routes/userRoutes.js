import express from 'express';
import {find, create, findById, update, remove} from '../controllers/userController';

let routes = express.Router();

routes.get('/api/users', async (req, res) => {

	try {

    	const users = await find(req.query);

    	res.json(users);
	    
  	} catch(err) {
  		res.status(500).json({ success: false });
  	}

});

routes.post('/api/users', async (req, res) => {

	try {

    	const user = await create(req.body);

    	res.json({ success: true, user: user });
	    
  	} catch(err) {
    	res.status(500).json({ success: false });
  	}

});

routes.get('/api/users/:id', async (req, res) => {

	try {

    	const users = await findById(req.params.id);

    	res.json(users);
	    
  	} catch(err) {
    	res.status(500).json({ success: false });
  	}

});

routes.put('/api/users/:id', async (req, res) => {

	try {

    	await update(req.params.id, req.body);

    	res.json({ success: true });
	    
  	} catch(err) {
    	res.status(500).json({ success: false });
  	}

});

routes.delete('/api/users/:id', async (req, res) => {

	try {

    	await remove(req.params.id);

    	res.json({ success: true });
	    
  	} catch(err) {
    	res.status(500).json({ success: false });
  	}

});


export default routes;