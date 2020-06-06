import path from 'path';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { Config } from 'apollo-server-koa';
import getWinstonLogger from './utils/logger';

log.verbose('Initiate building and merging GraphQL schemas');

const typesArray = loadFilesSync(path.join(__dirname, 'models/**/*.graphql'));
const typeDefs = mergeTypeDefs(typesArray);

const resolversArray = loadFilesSync(
  path.join(__dirname, 'models/**/resolvers.ts')
);
const resolvers = mergeResolvers(resolversArray);
const schema = makeExecutableSchema({ typeDefs, resolvers });

const fileLogger = getWinstonLogger({ label: 'GQL', onlyFile: 'queries.log' });

const plugins: Config['plugins'] = [
  {
    requestDidStart: ({ request }) => {
      if (request.operationName) return {};
      const startTime = Date.now();
      const id = Math.random().toString(16).slice(10);
      const { query } = request;
      const message = [`<--- REQUEST [${id}]`, query].join('\n');
      fileLogger.info(message);
      return {
        willSendResponse: (reqCtx) => {
          if (reqCtx.errors) return;
          const diff = Date.now() - startTime;
          fileLogger.info(`---> RESPONSE [${id}] (${diff}ms)`);
        },
        didEncounterErrors: (reqCtx) => {
          const diff = Date.now() - startTime;
          const error = _.get(reqCtx, 'errors.0.message', '');
          fileLogger.error(`---X ERROR [${id}] ${error} (${diff}ms)`);
        },
      };
    },
  },
];

export { schema, plugins };
