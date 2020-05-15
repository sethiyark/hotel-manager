import Router from 'koa-router';
import { User } from '../models/User';

const router = new Router();

router.post('/registration', async (ctx) => {
  try {
    const user = new User(ctx.request.body);
    await user.save();
    const token = await user.generateAuthToken();
    ctx.status = 201;
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
