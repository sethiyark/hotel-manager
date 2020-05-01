import appRoot from 'app-root-path';
import { transports, format, createLogger } from 'winston';
import chalk from 'chalk';
import config from 'config';
import stripAnsi from 'strip-ansi';
import { get, isObject } from 'lodash';
import stringify from 'json-stringify-safe';
import colorize from 'json-colorizer';

const LOG_CONFIG = config.get('logger');

const LOG_LEVEL = get(LOG_CONFIG, 'level', 'info');
const DEFAULT_LOG_FILE = get(LOG_CONFIG, 'default_log_file', 'app.log');
const ERROR_LOG_FILE = get(LOG_CONFIG, 'error_log_file', 'error.log');

const DEFAULT_LABEL = 'App';
const TIME_DIFF_LEVELS = ['verbose', 'debug', 'silly'];
const customColors = {
  default: chalk.white,
  error: chalk.red,
  warn: chalk.yellow,
  info: chalk.green,
  debug: chalk.cyan,
};

const customConsoleFormat = format((info) => {
  if (info.ms) {
    info.ms = chalk.italic(info.ms);
  }

  if (stripAnsi(info.level) in customColors) {
    const levelColor = customColors[stripAnsi(info.level)];

    if (info.timestamp) {
      info.timestamp = levelColor.dim(info.timestamp);
    }

    info.label = levelColor.bold(info.label);
    info.level = levelColor(info.level);
    info.message = info.isJSON
      ? colorize(info.message)
      : levelColor(info.message);

    if (info.ms) {
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

const applyLabel = (label = DEFAULT_LABEL) => {
  return format((info) => {
    if (!info.label) {
      info.label = label;
    }
    return info;
  })();
};

const baseFormat = (label) =>
  format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    applyTimeDiff(),
    applyLabel(label),
    format.printf((info) => {
      if (info.message && isObject(info.message)) {
        info.isJSON = true;
        const spaces = stringify(info.message).length > 50 ? 2 : 0;
        info.message = stringify(info.message, null, spaces);
      }
      return `${info.timestamp} [${info.level}] [${info.label}]: ${info.message}`;
    })
  );

const getWinstonLogger = ({ label = DEFAULT_LABEL, onlyFile = '' } = {}) => {
  const transportOptions = {
    error: {
      level: 'error',
      filename: `${appRoot}/logs/${ERROR_LOG_FILE}`,
      format: baseFormat(label),
      handleExceptions: true,
      maxsize: 5242880, // 5MB
      maxFiles: 2,
    },

    file: {
      level: LOG_LEVEL,
      filename: `${appRoot}/logs/${onlyFile || DEFAULT_LOG_FILE}`,
      format: baseFormat(label),
      handleExceptions: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    },

    console: {
      level: LOG_LEVEL,
      format: format.combine(
        baseFormat(label),
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

  const customTransports = onlyFile
    ? []
    : [
        new transports.Console(transportOptions.console),
        new transports.File(transportOptions.error),
      ];

  if (
    process.env.NODE_ENV === 'production' ||
    process.env.NODE_ENV === 'staging' ||
    onlyFile
  ) {
    customTransports.push(new transports.File(transportOptions.file));
  }

  return createLogger({
    transports: customTransports,
    exitOnError: false, // do not exit on handled exceptions
  });
};

export default getWinstonLogger;