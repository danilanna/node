import AuthenticateController from '../controllers/authenticateController';

const authenticateController = new AuthenticateController();

export const errorHandler = async (err, req, res, next) => {
  res.set('Access-Control-Allow-Origin', req.headers['origin']);

  let message = 'invalid token...';

  //Only update the token, if it has expired
	if (err.message === 'jwt expired') {
	  const refreshToken = req.headers['x-refresh-token'],
		    token = getToken(req);

  		//If the token or update token has not been sent
  		if(!refreshToken || !token) {
  			res.status(401).send(message);
  			return;
  		}

    	const {createToken, createRefreshToken, user} = await authenticateController.refreshTokens(token, refreshToken);

    	if (createToken && createRefreshToken) {
      	res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
      	res.set('x-token', createToken);
      	res.set('x-refresh-token', createRefreshToken);
        res.set('Access-Control-Allow-Credentials', true);
        res.set('Content-Type', 'application/json; charset=utf-8');
      	req.user = user;
      	next();
    	} else {
    		res.status(401).send(message);
        return;
    	}
  } else if (err.code === 'credentials_required') {
    message = 'Unauthorized';
    res.status(401).send(message);
  } else {
    message = 'insufficient permissions';
    res.status(401).send(message);
  }

};

const getToken = (req) => {
  return req.headers.authorization.split(' ')[1];
};