import Router from 'koa-router';
import { User } from '../models/User';

const BASE_API_URL = '/api/v1';
const router = new Router();

router.post(`${BASE_API_URL}/registration`, async (ctx) => {
  try {
    const { name, email, password } = ctx.request.body;
    const user = new User({ name, email, password });
    await user.save();
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        id: user.id,
      },
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
