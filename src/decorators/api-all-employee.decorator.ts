import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiBadRequest, ApiUnauthorized } from './api-response.decorator';
import { EmployeeResBody } from '../dto/employee.dto';
import { ServerErrorResBody } from '../dto/api-error.dto';

export const ApiAllEmployee = (): MethodDecorator => {
  return applyDecorators(
    ApiOperation({
      summary: 'get all employee',
      description: 'get all employee',
    }),
    ApiResponse({
      status: 200,
      description: 'success get all employee data',
      type: [EmployeeResBody],
    }),
    ApiBadRequest('api key harus dikirimkan!', 'not provided api key'),
    ApiUnauthorized('api key tidak valid!', 'invalid api key'),
    ApiResponse({
      status: 500,
      description: 'an unexpected error occurred',
      type: ServerErrorResBody,
    }),
  );
};
