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

log.info('Starting Koa server');

const server = app.listen(3001, () => {
  const address = server.address();
  // @ts-ignore
  const url = `http://${address.address}:${address.port}`;
  log.info(`Server listening on ${url}`);
});

function cleanup() {
  log.info('Attempting to gracefully shut down koa server');

  server.close((err) => {
    if (err) {
      log.error(`Error while shutting down koa server: ${err.toString()}`);
      process.exit(1);
    } else {
      log.info('Koa server shut down successful');
      process.exit(0);
    }
  });
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('SIGTSTP', cleanup);
