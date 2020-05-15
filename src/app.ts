import Koa from 'koa';
import koaBody from 'koa-bodyparser';
import cors from '@koa/cors';
import serve from 'koa-static';
import koaViews from 'koa-views';
import path from 'path';
import { ApolloServer } from 'apollo-server-koa';
import mongoose from 'mongoose';

import './global';
import './mongoose';
import { schema, plugins } from './graphql';
import { auth } from './utils/auth';

import registrationRouter from './routers/registration';
import loginRouter from './routers/login';
import indexRouter from './routers';

const app = new Koa();

// koaBody is needed just for POST.
app.use(koaBody());

// Support cross origin request for react app
app.use(cors());

const clientStatic = path.join(__dirname, '../dist/static');
app.use(
  koaViews(clientStatic, {
    extension: 'html',
    map: {
      html: 'handlebars',
    },
  })
);
app.use(serve(clientStatic));

const apolloServer = new ApolloServer({
  schema,
  plugins,
  context: auth,
});
apolloServer.applyMiddleware({ app, path: '/api' });

app.use(registrationRouter.routes());
app.use(registrationRouter.allowedMethods());

app.use(loginRouter.routes());
app.use(loginRouter.allowedMethods());

app.use(indexRouter.routes());
app.use(indexRouter.allowedMethods());

log.info('Starting Koa server');

const server = app.listen(3001, () => {
  const address = server.address();
  if (typeof address !== 'string') {
    const url = `http://${address.address}:${address.port}`;
    log.info(`Server listening on ${url}`);
  }
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
