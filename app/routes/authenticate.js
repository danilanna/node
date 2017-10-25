import express from 'express';
import {login, check} from '../controllers/authenticateController';

let apiRoutes = express.Router();

// ---------------------------------------------------------
// authentication (no middleware necessary since this isnt authenticated)
// ---------------------------------------------------------
// http://localhost:8080/api/authenticate
apiRoutes.route('/api/authenticate')
  .get(check)
  .post(login);

export default apiRoutes;


