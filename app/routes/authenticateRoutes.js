import express from 'express';
import AuthenticateController from '../controllers/authenticateController';

const authenticateController = new AuthenticateController();

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
    
		const { createToken, createRefreshToken } = await authenticateController.login(req.body);

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