// @ts-nocheck
import lodash from 'lodash';
import bluebird from 'bluebird';
import config from 'config';
import connectDB from './mongoose';
import getWinstonLogger from './utils/logger';

global.Promise.map = bluebird.map.bind(bluebird);
global.Promise.reduce = bluebird.reduce.bind(bluebird);
global._ = lodash;
global.log = getWinstonLogger();
global.cfg = (setting, fallback = null) => {
  try {
    return config.get(setting);
  } catch {
    if (typeof fallback === 'function') {
      return fallback();
    }
    return fallback;
  }
};

// Establish DB connection. Should be invoked only once.
connectDB();
