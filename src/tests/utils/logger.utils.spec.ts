import { logger } from '../mocks/logger.mock';

import { LoggerUtil } from '../../utils/logger.utils';

describe('logger utility test', () => {
  let loggerService: LoggerUtil;

  beforeEach(() => {
    loggerService = new LoggerUtil('TestClass');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log debug message correctly', () => {
    const message = 'Debug message';
    const dataObject = { key: 'value' };

    loggerService.debug(message, dataObject);
    expect(logger.debug).toHaveBeenCalledWith(
      `${message}{\n  "key": "value"\n}`,
      { classname: 'TestClass' },
    );

    loggerService.debug(message);
    expect(logger.debug).toHaveBeenCalledWith(message, {
      classname: 'TestClass',
    });

    loggerService.debug(message, 'invalid json');
    expect(logger.debug).toHaveBeenCalledWith(message + 'invalid json', {
      classname: 'TestClass',
    });
  });

  it('should log info message correctly', () => {
    const message = 'Info message';

    loggerService.info(message);

    expect(logger.info).toHaveBeenCalledWith(message, {
      classname: 'TestClass',
    });
  });

  it('should log http message correctly', () => {
    const message = 'HTTP message';

    loggerService.http(message);

    expect(logger.http).toHaveBeenCalledWith(message, {
      classname: 'TestClass',
    });
  });

  it('should log error stack correctly', () => {
    const error = new Error('Test error');

    loggerService.error(error);

    expect(logger.error).toHaveBeenCalledWith(error.stack, {
      classname: 'TestClass',
    });
  });

  it('should format log data correctly as JSON', () => {
    const data = { key: 'value' };

    const formattedData = (loggerService as any).logFormat(data);

    expect(formattedData).toBe('{\n  "key": "value"\n}');
  });

  it('should return string data as is when logFormat is called with string', () => {
    const data = 'string data';

    const formattedData = (loggerService as any).logFormat(data);

    expect(formattedData).toBe('string data');
  });

  it('should return string if JSON.parse fails in logFormat', () => {
    const data = '{ invalid json }';

    const formattedData = (loggerService as any).logFormat(data);

    expect(formattedData).toBe(data);
  });
});
