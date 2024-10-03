import { NextFunction, Request, Response } from 'express';
import { ServiceAuthMiddleware } from '../../middlewares/service-auth.middleware';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ServiceAuthUtils } from '../../utils/service-auth.utils';

jest.mock('../../utils/service-auth.utils');

describe('api key middleware test', () => {
  let middleware: ServiceAuthMiddleware;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    middleware = new ServiceAuthMiddleware();

    mockRequest = { get: jest.fn() };
    mockNext = jest.fn();
  });

  it('should throw BadRequestException when api key or token is not sent', () => {
    const badRequest = new BadRequestException(
      'api key atau token harus dikirimkan!',
    );

    (mockRequest.get as jest.Mock).mockReturnValue(undefined);

    expect(
      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      ),
    ).rejects.toThrow(badRequest);
    expect(mockRequest.get).toHaveBeenCalledWith('X-API-KEY');
    expect(mockRequest.get).toHaveBeenCalledWith('Authorization');
  });

  it('should throw Unauthorization when api key is not valid', () => {
    const unauthorized = new UnauthorizedException('api key tidak valid!');
    const mockHeaderGet = (header: string) => {
      if (header.toLowerCase() === 'x-api-key') {
        return 'abc';
      }
      return undefined;
    };

    (mockRequest.get as jest.Mock).mockImplementation(mockHeaderGet);
    (ServiceAuthUtils.validateApiKey as jest.Mock).mockReturnValue(false);

    expect(
      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      ),
    ).rejects.toThrow(unauthorized);
    expect(mockRequest.get).toHaveBeenCalledWith('X-API-KEY');
    expect(mockRequest.get).toHaveBeenCalledWith('Authorization');
  });

  it('should throw BadRequest when token is not valid', () => {
    const badRequest = new BadRequestException('format token tidak valid!');
    const mockHeaderGet = (header: string) => {
      if (header.toLowerCase() === 'authorization') {
        return 'abc';
      }
      return undefined;
    };

    (mockRequest.get as jest.Mock).mockImplementation(mockHeaderGet);

    expect(
      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      ),
    ).rejects.toThrow(badRequest);
    expect(mockRequest.get).toHaveBeenCalledWith('X-API-KEY');
    expect(mockRequest.get).toHaveBeenCalledWith('Authorization');
  });

  it('should throw Unauthorization when token is not valid', () => {
    const unauthorized = new UnauthorizedException('token tidak valid!');
    const mockHeaderGet = (header: string) => {
      if (header.toLowerCase() === 'authorization') {
        return 'bearer abc';
      }
      return undefined;
    };

    (mockRequest.get as jest.Mock).mockImplementation(mockHeaderGet);
    (ServiceAuthUtils.validateToken as jest.Mock).mockReturnValue(null);

    expect(
      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      ),
    ).rejects.toThrow(unauthorized);
    expect(mockRequest.get).toHaveBeenCalledWith('X-API-KEY');
    expect(mockRequest.get).toHaveBeenCalledWith('Authorization');
  });

  it('should call next function for valid api key', async () => {
    const mockHeaderGet = (header: string) => {
      if (header.toLowerCase() === 'x-api-key') {
        return 'abc';
      }
      return undefined;
    };

    (mockRequest.get as jest.Mock).mockImplementation(mockHeaderGet);
    (ServiceAuthUtils.validateApiKey as jest.Mock).mockReturnValue(true);

    await middleware.use(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );
    expect(mockRequest.get).toHaveBeenCalledWith('X-API-KEY');
    expect(mockRequest.get).toHaveBeenCalledWith('Authorization');
    expect(mockNext).toHaveBeenCalled();
  });

  it('should call next function for valid token', async () => {
    const mockHeaderGet = (header: string) => {
      if (header.toLowerCase() === 'authorization') {
        return 'bearer abc';
      }
      return undefined;
    };

    (mockRequest.get as jest.Mock).mockImplementation(mockHeaderGet);
    (ServiceAuthUtils.validateToken as jest.Mock).mockReturnValue({
      nik: '001230045600701',
    });

    await middleware.use(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );
    expect(mockRequest.get).toHaveBeenCalledWith('X-API-KEY');
    expect(mockRequest.get).toHaveBeenCalledWith('Authorization');
    expect(mockNext).toHaveBeenCalled();
  });
});
