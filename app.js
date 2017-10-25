// =================================================================
// ======================== IMPORT PACKAGES ========================
// =================================================================
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import _ from 'lodash';

// =================================================================
// ============================ ROUTES =============================
// =================================================================
import authenticate from './app/routes/authenticate';
import user from './app/routes/user';

// =================================================================
// =========================== HANDLERS ============================
// =================================================================
import {errorHandler} from './app/handlers/errorHandler';

// =================================================================
// ===================== SERVER CONFIGURATION ======================
// =================================================================
const port = process.env.PORT || 8080;
let app    = express();

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressJwt({secret: process.env.SECRET}).unless({path: ['/', { url: '/api/authenticate', methods: ['POST']}]}));

// use morgan to log requests to the console
app.use(morgan('dev'));

// error handler
app.use(errorHandler);

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
