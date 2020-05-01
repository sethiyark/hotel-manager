import mongoose from 'mongoose';
import config from 'config';
import getWinstonLogger from './utils/logger';

let DB_URL = config.get('db_url');

if (!DB_URL || DB_URL.length <= 0) {
  const DB_HOST = config.get('db_host');
  const DB_PORT = config.get('db_port');
  const DB_NAME = config.get('db_name');

  DB_URL = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;
}

const connectDB = () => {
  mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

  mongoose.connection.on('connected', () => {
    log.info(`Database connection established with URL: ${DB_URL}`);
  });

  mongoose.connection.on('error', (err) => {
    log.error(`Error in connection with database: ${err}`);
  });

  mongoose.connection.on('disconnected', () => {
    log.info('Database connection is closed');
  });

  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      log.warn('Database connection is closed due to application termination');
      process.exit(0);
    });
  });
};

if (!mongoose.Model.log) {
  Object.defineProperty(mongoose.Model, 'log', {
    get() {
      if (this._log) return this._log;
      this._log = getWinstonLogger({ label: this.name });
      return this._log;
    },
    set(newLog) {
      this._log = newLog;
    },
  });
}

export default connectDB;
