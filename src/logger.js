import appRoot from 'app-root-path';
import { createLogger, transports, format } from 'winston';
import path from 'path';
import chalk from 'chalk';

const customColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'cyan',
};

const transportOptions = {
  file: {
    level: 'info',
    filename: `${appRoot}/logs/app.log`,
    format: format.combine(
      format.printf(
        (info) =>
          `[${info.timestamp}] [${info.level}] [${info.label}]: ${info.message}`
      )
    ),
    handleExceptions: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  },

  console: {
    level: 'info',
    format: format.combine(
      format.colorize({
        all: true, // Colorize level and message
        // level: true,
        colors: customColors,
      }),
      format.printf(
        (info) =>
          `[${info.timestamp}] [${info.level}] [${info.label}]: ${info.message}`
      )
    ),
    handleExceptions: true,
  },
};

const customTransports = [];

if (process.env.NODE_ENV === 'development') {
  const devConsoleOpts = transportOptions.console;
  devConsoleOpts.level = 'debug';
  customTransports.push(new transports.Console(devConsoleOpts));
} else if (process.env.NODE_ENV === 'production') {
  customTransports.push(new transports.File(transportOptions.file));
} else {
  customTransports.push(new transports.Console(transportOptions.console));
}

console.log(chalk.bold.green('Initializing winston logger'));

const logger = createLogger({
  format: format.combine(
    format.label({ label: path.basename(process.mainModule.filename) }),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
  ),
  transports: customTransports,
  exitOnError: false, // do not exit on handled exceptions
});

logger.info('Winston logger initialized');

export default logger;

export { logger };
