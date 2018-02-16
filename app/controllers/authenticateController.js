import jwt from 'jsonwebtoken';
import _ from 'lodash';
import {getConfigurations} from '../../config/config';
import UserController from './userController';

const userController = new UserController(),
	config = getConfigurations(process.env.ENVIRONMENT),
	SECRET = config.session.secret,
	SECRET_2 = config.session.secret_2,
	tokenExpirationTime = config.session.tokenExpirationTime,
	refreshTokenExpirationTime = config.session.refreshTokenExpirationTime;

export default class AuthenticateController {

	async login(param) {

		const user = await userController.findOne(param);

		if (!user) {
			return {};
		}

		return this.createTokens(user, SECRET, SECRET_2 + user._id);

	};

	async refreshTokens(token, refreshToken) {


		let {
			user,
			refreshSecret
		} = this.verifyTokens(token, refreshToken);

		if (user) {

			user = await userController.findOne({
				_id: user._id
			});

			if (!user || !refreshSecret) {
				return {};
			}

			const {
				createToken,
				createRefreshToken
			} = this.createTokens(user, SECRET, refreshSecret);

			return {
				createToken,
				createRefreshToken,
				user
			};

		}

		return {};
	};

	createTokens(user, secret, secret2) {

		const createToken = jwt.sign(_.pick(user, ['_id', 'admin', 'permissions']), secret, {
			expiresIn: tokenExpirationTime
		});

		const createRefreshToken = jwt.sign(_.pick(user, '_id', 'admin', 'permissions'), secret2, {
			expiresIn: refreshTokenExpirationTime
		});

		return {
			createToken,
			createRefreshToken
		};
	};

	verifyTokens(token, refreshToken) {

		let userIdRefreshToken, userIdToken;

		let {
			_id
		} = jwt.decode(refreshToken);
		userIdRefreshToken = _id;


		if (!userIdRefreshToken) {
			return {};
		}

		const user = {
			_id: userIdRefreshToken
		};

		const refreshSecret = SECRET_2 + user._id;


		try {

			jwt.verify(refreshToken, refreshSecret);
			let {
				_id
			} = jwt.decode(token, SECRET);
			userIdToken = _id;


			//If the user is using another user's refresh token
			if (!userIdRefreshToken || !userIdToken || (userIdRefreshToken !== userIdToken)) {
				return {};
			}

		} catch (err) {
			return {};
		}

		return {
			user,
			refreshSecret
		};

	};

}