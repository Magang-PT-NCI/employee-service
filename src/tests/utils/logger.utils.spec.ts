import { logger } from '../mocks/logger.mock';
import { LoggerUtil } from '../../utils/logger.utils';

describe('logger utility test', () => {
  let loggerUtil: LoggerUtil;

  beforeEach(() => {
    loggerUtil = new LoggerUtil('TestClass');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log debug message correctly', () => {
    const message = 'Debug message';
    const dataObject = { key: 'value' };

    loggerUtil.debug(message, dataObject);
    expect(logger.debug).toHaveBeenCalledWith(
      `${message}{\n  "key": "value"\n}`,
      { classname: 'TestClass' },
    );

    loggerUtil.debug(message);
    expect(logger.debug).toHaveBeenCalledWith(message, {
      classname: 'TestClass',
    });

    loggerUtil.debug(message, 'invalid json');
    expect(logger.debug).toHaveBeenCalledWith(message + 'invalid json', {
      classname: 'TestClass',
    });
  });

  it('should log info message correctly', () => {
    const message = 'Info message';
    loggerUtil.info(message);
    expect(logger.info).toHaveBeenCalledWith(message, {
      classname: 'TestClass',
    });
  });

  it('should log http message correctly', () => {
    const message = 'HTTP message';
    loggerUtil.http(message);
    expect(logger.http).toHaveBeenCalledWith(message, {
      classname: 'TestClass',
    });
  });

  it('should log error stack correctly', () => {
    const error = new Error('Test error');
    loggerUtil.error(error);
    expect(logger.error).toHaveBeenCalledWith(error.stack, {
      classname: 'TestClass',
    });
  });

  it('should format log data correctly as JSON', () => {
    const data = { key: 'value' };
    const formattedData = (loggerUtil as any).logFormat(data);
    expect(formattedData).toBe('{\n  "key": "value"\n}');
  });

  it('should return string data as is when logFormat is called with string', () => {
    const data = 'string data';
    const formattedData = (loggerUtil as any).logFormat(data);
    expect(formattedData).toBe('string data');
  });

  it('should return string if JSON.parse fails in logFormat', () => {
    const data = '{ invalid json }';
    const formattedData = (loggerUtil as any).logFormat(data);
    expect(formattedData).toBe(data);
  });

  it('should return return log data with censored token and password', () => {
    let data: any = { nik: '12345', name: 'ucup' };
    let formattedData = (loggerUtil as any).logFormat(data);
    console.log(formattedData);
    let expectedResult = JSON.stringify(data, null, 2);
    expect(formattedData).toBe(expectedResult);

    data = { nik: '12345', name: 'ucup', password: 'admin$1234' };
    formattedData = (loggerUtil as any).logFormat(data);
    console.log(formattedData);
    expectedResult = JSON.stringify(
      { ...data, password: '**********' },
      null,
      2,
    );
    expect(formattedData).toBe(expectedResult);

    data = { token: 'klsadfjoinvwekureong' };
    formattedData = (loggerUtil as any).logFormat(data);
    console.log(formattedData);
    expectedResult = JSON.stringify({ ...data, token: '**********' }, null, 2);
    expect(formattedData).toBe(expectedResult);

    data = {
      nik: '12345',
      name: 'ucup',
      password: 'admin$1234',
      token: 'klsadfjoinvwekureong',
    };
    formattedData = (loggerUtil as any).logFormat(data);
    console.log(formattedData);
    expectedResult = JSON.stringify(
      { ...data, password: '**********', token: '**********' },
      null,
      2,
    );
    expect(formattedData).toBe(expectedResult);
  });
});
