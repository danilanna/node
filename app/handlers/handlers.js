import {refreshTokens} from '../controllers/authenticateController';

export const errorHandler = (err, req, res, next) => {

	//Only refresh the token, if it has been expired
  	if (err.message === 'jwt expired') {
		const refreshToken = req.headers['x-refresh-token'];
		const token = getToken(req);

		//Case has been not sent the token or refresh token
		if(!refreshToken || !token) {
			res.status(401).send('invalid token...');
			return;
		}

      	const {createToken, createRefreshToken, user} = refreshTokens(token, refreshToken);

      	if (createToken && createRefreshToken) {
        	res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
        	res.set('x-token', createToken);
        	res.set('x-refresh-token', createRefreshToken);
        	req.user = user;
        	next();
      	} else {
      		res.status(401).send('invalid token...');
			return;
      	}
    } else {
    	res.status(401).send('invalid token...');
		return;
    }
};

export const validateRequestHandler = (req, res, next) => {

	if ((req.method === 'POST' || req.method === 'PUT') && Object.keys(req.body).length === 0) {

        res.status(404).json({
          success: false,
          message: 'Invalid content'
        });
        return;
	}

	next();
};

const getToken = (req) => {
    return req.headers.authorization.split(' ')[1];
};