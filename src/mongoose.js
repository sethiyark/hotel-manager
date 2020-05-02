import mongoose from 'mongoose';
import getWinstonLogger from './utils/logger';

const connectDB = () => {
  log.info('Initiating database connection');
  const DB_URL = cfg('db.url', () => {
    const DB_HOST = cfg('db.host');
    const DB_PORT = cfg('db.port');
    const DB_NAME = cfg('db.name');
    return `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;
  });

  mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

  mongoose.connection.on('connected', () => {
    log.info(`Database connection established with URL: ${DB_URL}`);
  });

  mongoose.connection.on('error', (err) => {
    log.error(`Error in connection with database: (${err.message})`);
  });

  mongoose.connection.on('disconnected', () => {
    log.info('Database connection closed successfully');
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
