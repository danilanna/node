import * as cacheController from '../controllers/cacheController';

export const validateRequest = (req, res, next) => {
  if ((req.method === 'POST' || req.method === 'PUT') && Object.keys(req.body).length === 0) {
    res.status(404).json({
      success: false,
      message: 'Invalid content',
    });
    return;
  }

  next();
};

export const checkPermission = async (req, res, next) => {
  const permissions = await cacheController.getCacheValue(`${req.route.path} ${req.method}`);
  const { user } = req;
  const userPermissions = user.permissions;
  const isAdmin = user.admin;

  if (isAdmin) {
    return next();
  }

  for (let i = 0; i < userPermissions.length; i += 1) {
    for (let j = 0; j < permissions.length; j += 1) {
      if (permissions[j].toString() === userPermissions[i].toString()) {
        return next();
      }
    }
  }

  return res.status(403).send('forbidden');
};
