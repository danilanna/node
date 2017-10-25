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

      	const {newToken, newRefreshToken, user} = refreshTokens(token, refreshToken);

      	if (newToken && newRefreshToken) {
        	res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
        	res.set('x-token', newToken);
        	res.set('x-refresh-token', newRefreshToken);
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

const getToken = (req) => {
    return req.headers.authorization.split(' ')[1];
};