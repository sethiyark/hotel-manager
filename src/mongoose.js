import mongoose from 'mongoose';
import config from 'config';
import chalk from 'chalk';

const connected = chalk.bold.cyan;
const error = chalk.bold.red;
const disconnected = chalk.bold.yellow;
const termination = chalk.bold.yellow;

let DB_URL = config.get('db_url');

if (!DB_URL && DB_URL.length <= 0) {
  const DB_HOST = config.get('db_host');
  const DB_PORT = config.get('db_port');
  const DB_NAME = config.get('db_name');

  DB_URL = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;
}

module.exports = () => {
  mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

  mongoose.connection.on('connected', () => {
    console.log(
      connected('Database connection established with URL: ', DB_URL)
    );
  });

  mongoose.connection.on('error', (err) => {
    console.log(error(`Error in connection with database: ${err}`));
  });

  mongoose.connection.on('disconnected', () => {
    console.log(disconnected('Database connection is closed'));
  });

  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log(
        termination(
          'Database connection is closed due to application termination'
        )
      );
      process.exit(0);
    });
  });
};
