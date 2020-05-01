// @ts-nocheck
import _ from 'lodash';
import bluebird from 'bluebird';
import connectDB from './mongoose';
import getWinstonLogger from './utils/logger';

global.Promise.map = bluebird.map.bind(bluebird);
global.Promise.reduce = bluebird.reduce.bind(bluebird);
global._ = _;
global.log = getWinstonLogger();

// Establish DB connection. Should be invoked only once.
log.info('Initiating database connection');
connectDB();
