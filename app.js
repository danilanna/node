// =================================================================
// ======================== IMPORT PACKAGES ========================
// =================================================================
import express from 'express';
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

// =================================================================
// =========================== HANDLERS ============================
// =================================================================
import {errorHandler, validateRequestHandler, unauthorizedAccessHandler} from './app/handlers/handlers';

// =================================================================
// ===================== SERVER CONFIGURATION ======================
// =================================================================
const port = process.env.PORT || 8080;
let app    = express();
const config = getConfigurations(process.env.ENVIRONMENT);
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
app.use(expressJwt({secret: config.session.secret}).unless({path: ['/', { url: '/api/authenticate', methods: ['POST']}]}));

// use morgan to log requests to the console
app.use(morgan('dev'));

// error handler
app.use(errorHandler);
app.use(validateRequestHandler);
app.use(unauthorizedAccessHandler);

// =================================================================
// ============================ ROUTES =============================
// =================================================================
app.use(authenticate);
app.use(user);

// =================================================================
// ======================= START THE SERVER ========================
// =================================================================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);

export default app;
