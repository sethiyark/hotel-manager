// @ts-nocheck
import { generateTypeScriptTypes } from 'graphql-schema-typescript';

import './src/global';
import { schema } from './src/graphql';

generateTypeScriptTypes(schema, './typings/graphqlTypes.d.ts', {
  global: true,
  smartTResult: true,
})
  .then(() => {
    log.info('Successfully built GQL types');
    process.exit(0);
  })
  .catch((err) => {
    log.error(`Failed building GQL types for schema: ${err.message}`);
    process.exit(1);
  });
