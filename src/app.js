import Koa from 'koa';
import Router from 'koa-router';
import koaBody from 'koa-bodyparser';
import { ApolloServer } from 'apollo-server-koa';

import './global';
import schema from './graphql';

const app = new Koa();
const router = new Router();

// koaBody is needed just for POST.
router.use(koaBody());

router.get('/', async (ctx) => {
  ctx.body = 'Test App';
});

const apolloServer = new ApolloServer({ schema });
apolloServer.applyMiddleware({ app });

app.use(router.routes());
app.use(router.allowedMethods());

const server = app.listen(3000, () => {
  const address = server.address();
  const url = `http://${address.address}:${address.port}`;
  console.log(`Server listening on ${url}`);
});
