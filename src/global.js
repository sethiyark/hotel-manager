// @ts-nocheck
import _ from 'lodash';
import bluebird from 'bluebird';
import connectDB from './mongoose';
import log from './logger'; // initializes winston logger

global.Promise.map = bluebird.map.bind(bluebird);
global.Promise.reduce = bluebird.reduce.bind(bluebird);
global._ = _;
global.log = log;

// Establish DB connection. Should be invoked only once.
log.info('Initiating database connection');
connectDB();
