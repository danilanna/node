import jwt from 'jsonwebtoken';
import _ from 'lodash';
import getConfigurations from '../../config/config';
import UserController from './userController';

const userController = new UserController();
const config = getConfigurations(process.env.ENVIRONMENT).session;
const {
  secret, refreshSecret, tokenExpirationTime, refreshTokenExpirationTime,
} = config;

export default class AuthenticateController {
  async login(param) {
    const user = await userController.findOne(param);

    if (!user) {
      return {};
    }

    return this.createTokens(user, secret, refreshSecret + user._id);
  }

  async refreshTokens(token, refreshToken) {
    const {
      userIdRefreshToken,
      refreshTokenSecret,
    } = this.verifyTokens(token, refreshToken);

    if (userIdRefreshToken) {
      const user = await userController.findOne({
        _id: userIdRefreshToken,
      });

      if (!user || !refreshTokenSecret) {
        return {};
      }

      const {
        createToken,
        createRefreshToken,
      } = this.createTokens(user, secret, refreshTokenSecret);

      return {
        createToken,
        createRefreshToken,
        user,
      };
    }

    return {};
  }

  createTokens(user, secretToken, secretRefreshToken) {
    const createToken = jwt.sign(_.pick(user, ['_id', 'admin', 'permissions']), secretToken, {
      expiresIn: tokenExpirationTime,
    });

    const createRefreshToken = jwt.sign(_.pick(user, '_id', 'admin', 'permissions'), secretRefreshToken, {
      expiresIn: refreshTokenExpirationTime,
    });

    return {
      createToken,
      createRefreshToken,
    };
  }

  verifyTokens(token, refreshToken) {
    try {
      const userIdRefreshToken = jwt.decode(refreshToken)._id;

      if (!userIdRefreshToken) {
        return {};
      }

      const refreshTokenSecret = refreshSecret + userIdRefreshToken;

      jwt.verify(refreshToken, refreshTokenSecret);
      const userIdToken = jwt.decode(token, secret)._id;

      // If the user is using another user's refresh token
      if (!userIdRefreshToken || !userIdToken || (userIdRefreshToken !== userIdToken)) {
        return {};
      }

      return {
        userIdRefreshToken,
        refreshTokenSecret,
      };
    } catch (err) {
      return {};
    }
  }
}
