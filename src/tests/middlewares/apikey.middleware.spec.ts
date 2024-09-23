import { NextFunction, Request, Response } from 'express';
import { ApikeyMiddleware } from '../../middlewares/apikey.middleware';
import { EmployeeService } from '../../services/employee.service';
import { BadRequestException } from '@nestjs/common';

jest.mock('../../services/employee.service');

describe('api key middleware test', () => {
  let service: EmployeeService;
  let middleware: ApikeyMiddleware;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    service = new EmployeeService();
    middleware = new ApikeyMiddleware(service);

    mockRequest = { get: jest.fn() };
    mockNext = jest.fn();
  });

  it('should throw BadRequestException when api key is not sent', () => {
    const badRequest = new BadRequestException('Api key harus dikirimkan!');

    (mockRequest.get as jest.Mock).mockReturnValue(undefined);

    expect(
      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      ),
    ).rejects.toThrow(badRequest);
    expect(mockRequest.get).toHaveBeenCalledWith('X-API-KEY');
  });

  it('should throw BadRequestException when api key is not valid', () => {
    const badRequest = new BadRequestException('Api key tidak valid!');

    (mockRequest.get as jest.Mock).mockReturnValue('abc');
    (service.verifyApiKey as jest.Mock).mockReturnValue(false);

    expect(
      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      ),
    ).rejects.toThrow(badRequest);
    expect(mockRequest.get).toHaveBeenCalledWith('X-API-KEY');
  });

  it('should call next function for valid api key', async () => {
    (mockRequest.get as jest.Mock).mockReturnValue('abc');
    (service.verifyApiKey as jest.Mock).mockReturnValue(true);

    await middleware.use(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );
    expect(mockRequest.get).toHaveBeenCalledWith('X-API-KEY');
    expect(mockNext).toHaveBeenCalled();
  });
});
