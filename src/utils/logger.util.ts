import { createLogger, format, Logger } from 'winston';
import {
  Console,
  ConsoleTransportInstance,
  File,
  FileTransportInstance,
  FileTransportOptions,
} from 'winston/lib/winston/transports';
import {
  DESTINATION,
  FILE_FLAG,
  IS_SHOW_DATE,
  LEVEL,
  TRANSPORT,
} from '../config/logger.config';
import { getDateFormat } from './date.utils';

export class LoggerUtil {
  private static logger: Logger;

  public constructor(private readonly classname: string) {}

  static {
    const fileOptions: FileTransportOptions = {
      filename: DESTINATION,
      options: { loggerFileFlag: FILE_FLAG },
    };
    const transports: (ConsoleTransportInstance | FileTransportInstance)[] = [];

    if (TRANSPORT.toLowerCase() === 'file') {
      transports.push(new File(fileOptions));
    } else if (TRANSPORT.toLowerCase() === 'both') {
      transports.push(new Console({}), new File(fileOptions));
    } else {
      transports.push(new Console({}));
    }

    LoggerUtil.logger = createLogger({
      level: LEVEL,
      transports,
      format: format.printf(({ message, level, classname }) => {
        const date: Date = new Date();
        const time = getDateFormat(date, IS_SHOW_DATE);

        return `${time} - ${level.toUpperCase()} [${classname}] ${message}`;
      }),
    });
  }

  public debug(message: string, dataObject?: object | string) {
    const data: string = dataObject ? this.logFormat(dataObject) : '';
    LoggerUtil.logger.debug(`${message}${data}`, {
      classname: this.classname,
    });
  }

  public info(message: string) {
    LoggerUtil.logger.info(message, { classname: this.classname });
  }

  public http(message: string) {
    LoggerUtil.logger.http(message, { classname: this.classname });
  }

  public error(error: Error) {
    LoggerUtil.logger.error(error.stack, { classname: this.classname });
  }

  private logFormat(data: object | string): string {
    try {
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }
    } catch {
      return data as string;
    }

    return JSON.stringify(data, null, 2);
  }
}
