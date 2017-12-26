import * as cacheController from '../controllers/cacheController';

export const validateRequest = (req, res, next) => {
	if ((req.method === 'POST' || req.method === 'PUT') && Object.keys(req.body).length === 0) {

        res.status(404).json({
          success: false,
          message: 'Invalid content'
        });
        return;
	}

	next();
};

export const checkPermission = (req, res, next) => {
  const permissions = cacheController.getCacheValue(req.route.path + " " + req.method),
        user = req.user.user,
        userPermissions = user.permissions,
        isAdmin = user.admin;

  if(isAdmin) {
    return next();
  }

  for (let i = 0; i < userPermissions.length; i++) {
    if( permissions.indexOf(userPermissions[i]) !== -1 ) {
      return next();
    }
  }

  res.status(403).send('forbidden');
  
};