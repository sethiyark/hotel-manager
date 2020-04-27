import _ from 'lodash';
import Promise from 'bluebird';
import appRoot from 'app-root-path';
import connectDB from './mongoose';
import log from './logger'; // initializes winston logger

global.Promise = Promise;
global.appRoot = appRoot;
global._ = _;
global.log = log;

// Establish DB connection. Should be invoked only once.
log.info('Initiating database connection');
connectDB();
