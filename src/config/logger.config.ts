import { config } from 'dotenv';

config();

const validLevel = [
  'error',
  'warn',
  'info',
  'http',
  'verbose',
  'debug',
  'silly',
];

let level = process.env.LOGGER_LEVEL;
if (!validLevel.includes(level)) {
  level = 'http';
}

const flags = (process.env.LOGGER_FILE_FLAG || 'override').toLowerCase();

export const loggerTransport = process.env.LOGGER_TRANSPORT || 'console';
export const loggerLevel = level;
export const loggerFileFlag = flags === 'append' ? 'a' : 'w';
