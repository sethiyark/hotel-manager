import Router from 'koa-router';
import jwt from 'jsonwebtoken';
import config from 'config';
import { User } from '../models/User';

const REFRESH_TOKEN_KEY = _.get(config, 'auth.refresh_token_secret', null);
const BASE_API_URL = '/api/v1';

const router = new Router();

const refreshTokens = {};

router.post(`${BASE_API_URL}/login`, async (ctx) => {
  try {
    const { email, password } = ctx.request.body;
    const user = await User.findByCredentials(email, password);
    if (!user) {
      ctx.status = 401;
      ctx.body = {
        status: 'error',
        message: 'Authentication failure. Check credentials.',
      };
    } else {
      const accessToken = await user.generateAuthToken();
      const refreshToken = await user.generateRefreshToken();

      ctx.status = 200;
      ctx.body = {
        status: 'success',
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
          id: user.id,
        },
        token: {
          accessToken,
          refreshToken,
        },
      };

      refreshTokens[refreshToken] = user.id;
    }
  } catch (error) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: error.message,
    };
  }
});

router.post(`${BASE_API_URL}/refresh_token`, async (ctx) => {
  const { userId, refreshToken } = ctx.request.body;
  if (refreshToken in refreshTokens && refreshTokens[refreshToken] === userId) {
    try {
      try {
        jwt.verify(refreshToken, REFRESH_TOKEN_KEY);
      } catch (e) {
        // refresh token expired
        delete refreshTokens[refreshToken];
        throw e;
      }
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      } else {
        const accessToken = await user.generateAuthToken();
        ctx.status = 201;
        ctx.body = {
          accessToken,
        };
      }
    } catch (e) {
      ctx.status = 401;
      ctx.body = {
        status: 'error',
        message: `Error while generating access token: ${e.message}`,
      };
    }
  } else {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: 'Invalid refresh token',
    };
  }
});

export default router;

export { router };
