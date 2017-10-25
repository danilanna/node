import express from 'express';
import {findUsers} from '../controllers/userController';

let apiRoutes = express.Router();

// ---------------------------------------------------------
// authenticated routes
// ---------------------------------------------------------
// http://localhost:8080/api/users
apiRoutes.route('/api/users')
  .get(findUsers);

export default apiRoutes;