import express from 'express';
import {login} from '../controllers/authenticateController';

let routes = express.Router();

routes.get('/api/authenticate', (req, res) => {

	try {

    	res.json({
			success: true,
			message: 'Enjoy your token!'
		});
	    
  	} catch(err) {
  		res.status(500).json({ success: false });
  	}

});

routes.post('/api/authenticate', async (req, res) => {

	try {
    
		const { createToken, createRefreshToken } = await login(req.body);

		if(!createToken || !createRefreshToken) {
			res.status(404).json({
				success: false,
				message: 'User Not Found'
			});
			return;
		}

		res.json({
			success: true,
			message: 'Enjoy your token!',
			token: createToken,
			refreshToken: createRefreshToken
		});
	    
  	} catch(err) {
  		res.status(500).json({ success: false });
  	}

});

export default routes;