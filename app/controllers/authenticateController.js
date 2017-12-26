import jwt from 'jsonwebtoken';
import _ from 'lodash';
import {getConfigurations} from '../../config/config';
import {findOne} from './userController';

const config = getConfigurations(process.env.ENVIRONMENT);

const SECRET = config.session.secret;
const SECRET_2 = config.session.secret_2;
const tokenExpirationTime = config.session.tokenExpirationTime;
const refreshTokenExpirationTime = config.session.refreshTokenExpirationTime;

export const login = async (param) => {
	
	const user = await findOne(param);

	if(!user) {
		return {};
	}

	return createTokens(user, SECRET, SECRET_2 + user._id);

};

export const refreshTokens = (token, refreshToken) => {
  	const {user, refreshSecret} = verifyTokens(token, refreshToken);

  	if(!user || !refreshSecret) {
  		return {};
  	}

	const {createToken, createRefreshToken} = createTokens(user, SECRET, refreshSecret);

	return {createToken, createRefreshToken, user};
};

const createTokens = (user, secret, secret2) => {

  	const createToken = jwt.sign({ user: _.pick(user, ['_id', 'admin', 'permissions'])}, secret, { expiresIn: tokenExpirationTime});

  	const createRefreshToken = jwt.sign({ user: _.pick(user, '_id', 'admin', 'permissions')}, secret2, { expiresIn: refreshTokenExpirationTime});

  	return {createToken, createRefreshToken};
};

const verifyTokens = (token, refreshToken) => {

	let userIdRefreshToken, userIdToken;

  	let { user: { _id } } = jwt.decode(refreshToken);
   	userIdRefreshToken = _id;

	if (!userIdRefreshToken) {
		return {};
	}

	const user = { _id: userIdRefreshToken };

	const refreshSecret = SECRET_2 + user._id;

	try {

		jwt.verify(refreshToken, refreshSecret);
		let { user: { _id } } = jwt.decode(token, SECRET);
		userIdToken = _id;

		//If the user is using another user's refresh token
		if(!userIdRefreshToken || !userIdToken || (userIdRefreshToken !== userIdToken)) {
		  return {};
		}

	} catch (err) {
		return {};
	}

	return {user, refreshSecret};

};