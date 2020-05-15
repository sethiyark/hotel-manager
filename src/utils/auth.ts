import jwt from 'jsonwebtoken';
import config from 'config';
import { AuthenticationError, Config } from 'apollo-server-koa';
import { User } from '../models/User';

const JWT_KEY = _.get(config, ['auth', 'jwtKey'], null);

const auth: Config['context'] = async (ctx, next) => {
  let token = _.get(ctx, ['ctx', 'request', 'header', 'authorization'], null);

  if (_.isEmpty(token)) {
    throw new AuthenticationError(
      'User is not authorized to access this resource'
    );
  } else {
    token = token.replace('Bearer ', '');
    try {
      const data = jwt.verify(token, JWT_KEY);
      const user = await User.findOne({ _id: data._id, 'tokens.token': token });

      if (_.isEmpty(user)) {
        return new Error('Token expired.');
      }

      ctx.user = user;
      ctx.authToken = token;
      return next();
    } catch (error) {
      throw new AuthenticationError(
        `Error in token validation: ${error.message}`
      );
    }
  }
};

export default auth;

export { auth };
