import { logFormat, logger } from '../../utils/logger.utils';
import { Logger } from 'winston';

describe('logger utility test', () => {
  it('should return winston logger object', () => {
    expect(logger).toBeInstanceOf(Logger);
  });

  it('should return correct value for logFormat', () => {
    expect(logFormat('')).toEqual('');
    expect(logFormat('abc')).toEqual('abc');
    expect(logFormat(true)).toEqual(true);
    expect(logFormat(100)).toEqual(100);

    const data = {
      status: 200,
      message: 'OK',
    };
    const expected = '{\n  "status": 200,\n  "message": "OK"\n}';
    expect(logFormat(data)).toEqual(expected);
    expect(logFormat(JSON.stringify(data))).toEqual(expected);
  });
});
