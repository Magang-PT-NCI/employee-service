import { LoggerMiddleware } from '../../middlewares/logger.middleware';
import { Request, Response, NextFunction } from 'express';
import { logFormat, logger } from '../../utils/logger.utils';

jest.mock('../../utils/logger.utils');

describe('logger middleware test', () => {
  let middleware: LoggerMiddleware;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let sendMock: jest.Mock;

  beforeEach(() => {
    middleware = new LoggerMiddleware();
    mockRequest = {
      method: 'GET',
      originalUrl: '/test-url',
    };
    sendMock = jest.fn(); // Mocking res.send
    mockResponse = {
      statusCode: 200,
      statusMessage: 'OK',
      send: sendMock,
      on: jest.fn(),
    };
    mockNext = jest.fn();
  });

  it('should log request and pass to next middleware', () => {
    middleware.use(mockRequest as Request, mockResponse as Response, mockNext);
    expect(logger.http).toHaveBeenCalledWith('GET /test-url');
    expect(mockNext).toHaveBeenCalled();
  });

  it('should override res.send and log response body', () => {
    const body = { message: 'response body' };

    middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

    (logFormat as jest.Mock).mockReturnValue(JSON.stringify(body));
    mockResponse.send(body); // Call the overridden send method

    expect(logger.debug).toHaveBeenCalledWith(
      'response body: ' + JSON.stringify(body),
    );
    expect(sendMock).toHaveBeenCalledWith(body); // Ensure original send is still called
  });

  it('should log duration on res.finish', () => {
    let finishCallback = jest.fn();
    (mockResponse.on as jest.Mock).mockImplementation((event, callback) => {
      if (event === 'finish') {
        finishCallback = callback;
      }
    });

    middleware.use(mockRequest as Request, mockResponse as Response, mockNext);
    finishCallback(); // Simulate the 'finish' event

    expect(logger.http).toHaveBeenCalledWith(
      expect.stringContaining('GET /test-url - 200 OK -'),
    );
  });
});
