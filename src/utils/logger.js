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
const DEFAULT_LOG_FILE = get(
  LOG_CONFIG,
  'outLog',
  `${appRoot}/logs/app.log`
).replace('{{appRoot}}', appRoot);
const ERROR_LOG_FILE = get(
  LOG_CONFIG,
  'outError',
  `${appRoot}/logs/error.log`
).replace('{{appRoot}}', appRoot);

const DEFAULT_LABEL = 'App';
const TIME_DIFF_LEVELS = ['debug', 'silly'];
const FILE_INFO_LEVELS = ['error', 'warn'];

const customColors = {
  default: chalk.white,
  error: chalk.red,
  warn: chalk.yellow,
  info: chalk.green,
  debug: chalk.cyan,
  verbose: chalk.hex('#DDA0DD'),
  silly: chalk.gray,
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

    if (info.callerInfo) {
      info.callerInfo = chalk.bgBlue.white(info.callerInfo);
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

const applyFileInfo = format((info) => {
  if (FILE_INFO_LEVELS.includes(stripAnsi(info.level))) {
    const targetValue = new Error().stack.split('at ')[22] || '';
    const targetFile = targetValue.match(/\((.*)\)/) || [null, targetValue];
    [, info.callerInfo] = targetFile;
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
    applyFileInfo(),
    format.printf((info) => {
      if (info.message && isObject(info.message)) {
        info.isJSON = true;
        const spaces = stringify(info.message).length > 50 ? 2 : 0;
        info.message = stringify(info.message, null, spaces);
      }
      const template = [
        info.callerInfo,
        `${info.timestamp} [${info.level}] [${info.label}]: ${info.message}`,
      ].filter(Boolean);
      return template.join('\n');
    })
  );

const getWinstonLogger = ({ label = DEFAULT_LABEL, onlyFile = '' } = {}) => {
  const customFilePath = onlyFile && `${appRoot}/logs/${onlyFile}`;

  const transportOptions = {
    error: {
      level: 'error',
      filename: ERROR_LOG_FILE,
      format: baseFormat(label),
      handleExceptions: true,
      maxsize: 5242880, // 5MB
      maxFiles: 2,
    },

    file: {
      level: LOG_LEVEL,
      filename: customFilePath || DEFAULT_LOG_FILE,
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
        format.printf((info) => {
          const result = [
            info.callerInfo,
            info.ms
              ? `${info.timestamp} [${info.label}] [${info.level}]: ${info.message} (${info.ms})`
              : `${info.timestamp} [${info.label}] [${info.level}]: ${info.message}`,
          ].filter(Boolean);
          return result.join('\n');
        })
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
