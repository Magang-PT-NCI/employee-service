import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  ApiBadRequest,
  ApiNotFound,
  ApiUnauthorized,
} from './api-response.decorator';
import { EmployeeResBody } from '../dto/employee.dto';

export const ApiEmployee = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'get employee',
      description: 'get specific employee by nik',
    }),
    ApiResponse({
      status: 200,
      description: 'success get employee data',
      type: EmployeeResBody,
    }),
    ApiBadRequest('api key harus dikirimkan!', 'not provided api key'),
    ApiUnauthorized('api key tidak valid!', 'invalid api key'),
    ApiNotFound('karyawan tidak ditemukan!', 'employee does not exist'),
  );
};
