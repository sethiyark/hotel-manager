// @ts-nocheck
import _ from 'lodash';
import bluebird from 'bluebird';
import config from 'config';
import connectDB from './mongoose';
import getWinstonLogger from './utils/logger';

global.Promise.map = bluebird.map.bind(bluebird);
global.Promise.reduce = bluebird.reduce.bind(bluebird);
global._ = _;
global.log = getWinstonLogger();
global.cfg = (configPath) => {
  try {
    return config.get(configPath);
  } catch {
    return null;
  }
};

// Establish DB connection. Should be invoked only once.
connectDB();
