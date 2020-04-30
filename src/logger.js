import appRoot from 'app-root-path';
import { loggers, transports, format } from 'winston';
import chalk from 'chalk';
import config from 'config';

const stripAnsi = require('strip-ansi');

const LOG_CONFIG = config.get('logger');
const DEFAULT_LABEL = 'default';
const LOG_LEVEL = LOG_CONFIG && LOG_CONFIG.level ? LOG_CONFIG.level : 'info';

const DEFAULT_LOG_FILE =
  LOG_CONFIG && LOG_CONFIG.default_log_file
    ? LOG_CONFIG.default_log_file
    : '/log/app.log';

const ERROR_LOG_FILE =
  LOG_CONFIG && LOG_CONFIG.error_log_file
    ? LOG_CONFIG.error_log_file
    : '/log/app.log';

const TIME_DIFF_LEVELS = ['verbose', 'debug', 'silly', 'warn'];

const customColors = {
  default: chalk.white,
  error: chalk.red,
  warn: chalk.yellow,
  info: chalk.green,
  debug: chalk.cyan,
};

const customConsoleFormat = format((info) => {
  if (!info.label) {
    // eslint-disable-next-line no-param-reassign
    info.label = DEFAULT_LABEL;
  }

  if (stripAnsi(info.level) in customColors) {
    const levelColor = customColors[stripAnsi(info.level)];

    if (info.timestamp) {
      // eslint-disable-next-line no-param-reassign
      info.timestamp = levelColor.dim(info.timestamp);
    }

    // eslint-disable-next-line no-param-reassign
    info.label = levelColor.bold(info.label);

    // eslint-disable-next-line no-param-reassign
    info.level = levelColor(info.level);

    // eslint-disable-next-line no-param-reassign
    info.message = levelColor(info.message);

    if (info.ms) {
      // eslint-disable-next-line no-param-reassign
      info.ms = levelColor.italic(info.ms);
    }
  }

  return info;
});

// Separating timeDiff format as this is to be used in file transport as well
const applyTimeDiff = format((info) => {
  if (TIME_DIFF_LEVELS.includes(stripAnsi(info.level))) {
    format.ms().transform(info);
  }
  return info;
});

const transportOptions = {
  error: {
    level: 'error',
    filename: appRoot + ERROR_LOG_FILE,
    format: format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),

      applyTimeDiff(),

      format.printf(
        (info) =>
          `${info.timestamp} [${info.level}] [${info.label}]: ${info.message}`
      )
    ),
    handleExceptions: true,
    maxsize: 5242880, // 5MB
    maxFiles: 2,
  },

  file: {
    level: LOG_LEVEL,
    filename: appRoot + DEFAULT_LOG_FILE,
    format: format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),

      applyTimeDiff(),

      format.printf(
        (info) =>
          `${info.timestamp} [${info.level}] [${info.label}]: ${info.message}`
      )
    ),
    handleExceptions: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  },

  console: {
    level: LOG_LEVEL,
    format: format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),

      applyTimeDiff(),

      customConsoleFormat(),

      format.printf((info) =>
        info.ms
          ? `${info.timestamp} [${info.label}] [${info.level}]: ${info.message} (${info.ms})`
          : `${info.timestamp} [${info.label}] [${info.level}]: ${info.message}`
      )
    ),
    colorize: false,
    handleExceptions: true,
  },
};

const customTransports = [
  new transports.Console(transportOptions.console),
  new transports.File(transportOptions.error),
];

if (
  process.env.NODE_ENV === 'production' ||
  process.env.NODE_ENV === 'staging'
) {
  customTransports.push(new transports.File(transportOptions.file));
}

console.log(chalk.bold.green('Initializing winston logger'));

const logger = loggers.add('default', {
  transports: customTransports,
  exitOnError: false, // do not exit on handled exceptions
});

logger.info('Winston logger initialized');

export default logger;

export { logger };
