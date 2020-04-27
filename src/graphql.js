import fs from 'fs';
import path from 'path';
import { mergeSchemas, makeExecutableSchema } from 'graphql-tools';

const modelBasePath = path.resolve(__dirname, 'models');
const allModels = _.filter(fs.readdirSync(modelBasePath), (file) =>
  fs.statSync(path.resolve(modelBasePath, file)).isDirectory()
);

log.debug('Initiate building and merging GraphQL schemas');

const subschemas = _.map(allModels, (model) => {
  try {
    const typeDefPath = path.resolve(modelBasePath, model, 'types.graphql');
    const resolverPath = path.resolve(modelBasePath, model, 'resolvers.js');

    const typeDefs = fs.readFileSync(typeDefPath, { encoding: 'utf-8' });

    // eslint-disable-next-line import/no-dynamic-require, global-require
    const required = require(resolverPath);
    const resolvers = required.default || required;

    const schema = makeExecutableSchema({ typeDefs, resolvers });
    return { schema };
  } catch {
    log.error(`gql schema error in model: ${model}`);
    return null;
  }
}).filter(Boolean);

log.info('GrapghQL schemas compiled');

const schema = mergeSchemas({ subschemas });

export default schema;
