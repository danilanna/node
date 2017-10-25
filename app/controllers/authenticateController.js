import jwt from 'jsonwebtoken';
import _ from 'lodash';
import dotenv from 'dotenv';

dotenv.config();

const SECRET = process.env.SECRET;
const SECRET_2 = process.env.SECRET_2;

export const check = (req, res) => {
	res.json({
		success: true,
		message: 'Enjoy your token!'
	});
};

export const login = (req, res) => {
	const { token, refreshToken } = authenticate(req.body, SECRET, SECRET_2);

	res.json({
		success: true,
		message: 'Enjoy your token!',
		token: token,
		refreshToken: refreshToken
	});
};

export const refreshTokens = (token, refreshToken) => {
  	const {user, refreshSecret} = verifyTokens(token, refreshToken);

  	if(!user || !refreshSecret) {
  		return {};
  	}

	const [newToken, newRefreshToken] = createTokens(user, SECRET, refreshSecret);

	return {newToken, newRefreshToken, user};
};

const authenticate = (user, SECRET, SECRET_2) => {

  	//TODO call database.
  
  	const [token, refreshToken] = createTokens(user, SECRET, SECRET_2 + user.id);

  	return {token, refreshToken};
};

const createTokens = (user, secret, secret2) => {

  	const createToken = jwt.sign({ user: _.pick(user, ['id', 'isAdmin'])}, secret, { expiresIn: process.env.ENVIRONMENT === 'test' ? '5s' : '1m'});

  	const createRefreshToken = jwt.sign({ user: _.pick(user, 'id')}, secret2, {  expiresIn: '7d'});

  	return [createToken, createRefreshToken];
};

const verifyTokens = (token, refreshToken) => {

	let userIdRefreshToken, userIdToken;

  	let { user: { id } } = jwt.decode(refreshToken);
   	userIdRefreshToken = id;

	if (!userIdRefreshToken) {
		return {};
	}

	const user = { id: userIdRefreshToken };

	const refreshSecret = SECRET_2 + user.id;

	try {

		jwt.verify(refreshToken, refreshSecret);
		let { user: { id } } = jwt.decode(token, SECRET);
		userIdToken = id;

		//In case the user is using the refresh token from other user
		if(!userIdRefreshToken || !userIdToken || (userIdRefreshToken !== userIdToken)) {
		  return {};
		}

	} catch (err) {
		return {};
	}

	return {user, refreshSecret};

};