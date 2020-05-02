import Koa from 'koa';
import Router from 'koa-router';
import koaBody from 'koa-bodyparser';
import { ApolloServer } from 'apollo-server-koa';
import mongoose from 'mongoose';

import './global';
import { schema, plugins } from './graphql';

const app = new Koa();
const router = new Router();

// koaBody is needed just for POST.
app.use(koaBody());

router.get('/', async (ctx) => {
  ctx.body = 'Test App';
});

const apolloServer = new ApolloServer({ schema, plugins });
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
  log.verbose('Terminating database connection');
  mongoose.connection.close((error) => {
    if (error) {
      log.error(`Error closing DB connection: (${error.message})`);
    }
    log.verbose('Attempting to gracefully shut down koa server');
    server.close((err) => {
      if (err) {
        log.error(`Error while shutting down koa server: (${err.message})`);
      } else {
        log.info('Koa server shut down successful');
      }
      if (err || error) process.exit(1);
      process.exit(0);
    });
  });
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('SIGTSTP', cleanup);
