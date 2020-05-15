import Router from 'koa-router';
import { User } from '../models/User';

const router = new Router();

router.post('/login', async (ctx) => {
  try {
    const { email, password } = ctx.request.body;
    const user = await User.findByCredentials(email, password);
    if (!user) {
      ctx.status = 401;
      ctx.body = {
        status: 'error',
        message: 'Authentication failure. Check credentials.',
      };
    }
    const token = await user.generateAuthToken();
    ctx.status = 200;
    ctx.body = {
      status: 'success',
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        id: user.id,
      },
      token,
    };
  } catch (error) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: error.message,
    };
  }
});

export default router;

export { router };
