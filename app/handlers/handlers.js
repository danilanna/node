import {refreshTokens} from '../controllers/authenticateController';

export const errorHandler = (err, req, res, next) => {

  //Only update the token, if it has expired
	if (err.message === 'jwt expired') {
	  const refreshToken = req.headers['x-refresh-token'],
		    token = getToken(req);

  		//If the token or update token has not been sent
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

export const unauthorizedAccessHandler = (err, req, res, next) => {
	if (err.code === 'permission_denied') {
	  res.status(401).send('insufficient permissions');
	}
};

const getToken = (req) => {
  return req.headers.authorization.split(' ')[1];
};