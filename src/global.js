import _ from 'lodash';
import Promise from 'bluebird';

import connectDB from './mongoose';

global.Promise = Promise;
global._ = _;

// Establish DB connection. Should be invoked only once.
connectDB();
