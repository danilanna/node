// =================================================================
// ======================== IMPORT PACKAGES ========================
// =================================================================
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import _ from 'lodash';
import mongoose from 'mongoose';
import {getConfigurations} from './config/config';

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
import {errorHandler} from './app/handlers/handlers';
import {validateRequest} from './app/middlewares/middlewares';

// =================================================================
// ===================== SERVER CONFIGURATION ======================
// =================================================================
let app    = express();
const config = getConfigurations(process.env.ENVIRONMENT),
port = process.env.PORT || 8083,
corsOptions = {
  origin: 'http://localhost:8080',
  optionsSuccessStatus: 200,
  credentials: true
};
mongoose.Promise = global.Promise;

if(process.env.ENVIRONMENT === 'test'){
	mongoose.connect(config.database, { useMongoClient: true }, () => {
	  mongoose.connection.db.dropDatabase();
	});
} else {
	mongoose.connect(config.database, { useMongoClient: true });
}

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressJwt({secret: config.session.secret}).unless({path: ['/', { url: '/api/authenticate', methods: ['POST', 'OPTIONS']}]}));

// use morgan to log requests to the console
app.use(morgan('dev'));

//cors
app.use(cors(corsOptions))

// error handler
app.use(errorHandler);
app.use(validateRequest);

cacheController.setInitialCache().then(() => {
	console.log('cache loaded');
});

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
// ===================================== ver se precisa disso!!!!!
app.options('*', cors(corsOptions))
app.listen(port);
console.log('Magic happens at http://localhost:' + port);

export default app;
