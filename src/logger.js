import appRoot from 'app-root-path';
import { createLogger, transports, format } from 'winston';
import chalk from 'chalk';
import config from 'config';
import stripAnsi from 'strip-ansi';
import { get } from 'lodash';

const LOG_CONFIG = config.get('logger');
const DEFAULT_LABEL = 'default';
const LOG_LEVEL = get(LOG_CONFIG, 'level', 'info');
const TIME_DIFF_LEVELS = ['verbose', 'debug', 'silly'];
const customColors = {
  default: chalk.white,
  error: chalk.red,
  warn: chalk.yellow,
  info: chalk.green,
  debug: chalk.cyan,
  timestamp: chalk.dim.gray,
};

const customConsoleFormat = format((info) => {
  if (info.timestamp) {
    info.timestamp = customColors.timestamp(info.timestamp);
  }

  if (info.ms) {
    info.ms = chalk.italic(info.ms);
  }

  if (!info.label) {
    info.label = DEFAULT_LABEL;
  }

  if (stripAnsi(info.level) in customColors) {
    const levelColor = customColors[stripAnsi(info.level)];

    info.label = levelColor.bold(info.label);
    info.level = levelColor(info.level);
    info.message = levelColor(info.message);
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
  file: {
    level: LOG_LEVEL,
    filename: `${appRoot}/logs/app.log`,
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

const customTransports = [];

if (
  process.env.NODE_ENV === 'production' ||
  process.env.NODE_ENV === 'staging'
) {
  customTransports.push(new transports.File(transportOptions.file));
} else {
  customTransports.push(new transports.Console(transportOptions.console));
}

console.log(chalk.bold.green('Initializing winston logger'));

const logger = createLogger({
  transports: customTransports,
  exitOnError: false, // do not exit on handled exceptions
});

logger.info('Winston logger initialized');

export default logger;

export { logger };
