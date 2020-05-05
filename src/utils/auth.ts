import jwt from 'jsonwebtoken';
import config from 'config';
import { AuthenticationError } from 'apollo-server-koa';
import { User } from '../models/User';

const JWT_KEY = _.get(config, ['auth', 'jwtKey'], null);

const updateAuthContext = async (ctx) => {
  let token = _.get(ctx, ['ctx', 'request', 'header', 'authorization'], null);

  // We return context without modification in case of login and signup mutations
  if (_.isEmpty(token)) {
    return ctx;
  }

  token = token.replace('Bearer ', '');

  try {
    const data = jwt.verify(token, JWT_KEY);
    const user = await User.findOne({ _id: data._id, 'tokens.token': token });

    if (_.isEmpty(user)) {
      return new Error('Token expired.');
    }

    ctx.user = user;
    ctx.authToken = token;
  } catch (error) {
    return new AuthenticationError(
      // eslint-disable-next-line comma-dangle
      `Not authorized to access this resource. ${error.message}`
    );
  }

  return ctx;
};

async function checkAuth(ctx) {
  if (_.isEmpty(ctx.user)) {
    throw new AuthenticationError('User is not authenticated');
  }
}

export default updateAuthContext;

export { updateAuthContext, checkAuth };
