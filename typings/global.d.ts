import lodash from 'lodash';
import bluebird from 'bluebird';
import { Logger } from 'winston';

declare global {
  const _: typeof lodash;
  const log: Logger;

  interface PromiseConstructor {
    map: typeof bluebird.map;
    reduce: typeof bluebird.reduce;
  }
}
