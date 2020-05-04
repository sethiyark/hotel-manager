import fs from 'fs';
import path from 'path';
import { mergeSchemas, makeExecutableSchema } from 'graphql-tools';
import getWinstonLogger from './utils/logger';

log.verbose('Initiate building and merging GraphQL schemas');

const modelBasePath = path.resolve(__dirname, 'models');
const allModels = _.filter(fs.readdirSync(modelBasePath), (file) =>
  fs.statSync(path.resolve(modelBasePath, file)).isDirectory()
);

const subschemas = _.map(allModels, (model) => {
  try {
    const typeDefPath = path.resolve(modelBasePath, model, 'types.graphql');
    const resolverPath = path.resolve(modelBasePath, model, 'resolvers.ts');

    const typeDefs = fs.readFileSync(typeDefPath, { encoding: 'utf-8' });

    // eslint-disable-next-line import/no-dynamic-require, global-require
    const required = require(resolverPath);
    const resolvers = required.default || required;

    const schema = makeExecutableSchema({ typeDefs, resolvers });
    return { schema };
  } catch (err) {
    log.error(`gql schema error in ${model} model: (${err.message})`);
    return null;
  }
}).filter(Boolean);

const schema = mergeSchemas({ subschemas });

log.verbose('GraphQL schemas compiled');

const fileLogger = getWinstonLogger({ label: 'GQL', onlyFile: 'queries.log' });

/** @type {import('apollo-server-koa').Config["plugins"]} */
const plugins = [
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
