// =================================================================
// ======================== IMPORT PACKAGES ========================
// =================================================================
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import expressJwt from 'express-jwt';
import mongoose from 'mongoose';
import Promise from 'bluebird';
import winston from 'winston';
import getConfigurations from './config/config';

// =================================================================
// ============================ ROUTES =============================
// =================================================================
import authenticate from './app/routes/authenticateRoutes';
import user from './app/routes/userRoutes';
import permission from './app/routes/permissionRoutes';
import service from './app/routes/serviceRoutes';

// =================================================================
// ========================== CONTROLLERS ==========================
// =================================================================
import * as cacheController from './app/controllers/cacheController';

// =================================================================
// =========================== HANDLERS ============================
// =================================================================
import errorHandler from './app/handlers/handlers';
import { validateRequest } from './app/middlewares/middlewares';

const startServer = async () => {
  const config = getConfigurations(process.env.ENVIRONMENT);
  const port = config.PORT || 8083;
  const corsOptions = {
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true,
  };

  mongoose.Promise = Promise;
  mongoose.connect(config.database, { useMongoClient: true });

  await cacheController.setInitialCache();

  // =================================================================
  // ===================== SERVER CONFIGURATION ======================
  // =================================================================
  const app = express();

  // use body parser so we can get info from POST and or URL parameters
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(expressJwt({ secret: config.session.secret }).unless({ path: ['/', { url: '/api/authenticate', methods: ['POST', 'OPTIONS'] }] }));

  // use morgan to log requests to the console
  app.use(morgan('dev'));

  // cors
  app.use(cors(corsOptions));

  // error handler
  app.use(errorHandler);
  app.use(validateRequest);

  // =================================================================
  // ============================ ROUTES =============================
  // =================================================================
  app.use(authenticate);
  app.use(user);
  app.use(permission);
  app.use(service);

  // =================================================================
  // ======================= START THE SERVER ========================
  // =================================================================
  app.listen(port);
  winston.log('info', `Magic happens at http://localhost:${port}`);
};

startServer();
