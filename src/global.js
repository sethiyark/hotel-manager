import _ from 'lodash';
import Promise from 'bluebird';
import appRoot from 'app-root-path';
import connectDB from './mongoose';
import log from '../config/logger'; // initializes winston logger

global.Promise = Promise;
global.appRoot = appRoot;
global._ = _;

// Establish DB connection. Should be invoked only once.
log.info('Connecting to database');
connectDB();
