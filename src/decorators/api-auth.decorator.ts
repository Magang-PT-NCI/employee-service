import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiBadRequest, ApiUnauthorized } from './api-response.decorator';
import { LoginResBody, ValidateTokenResBody } from '../dto/auth.dto';
import { ServerErrorResBody } from '../dto/api-error.dto';

export const ApiLogin = (): MethodDecorator => {
  return applyDecorators(
    ApiOperation({
      summary: 'perform login',
      description: 'perform user login and get a jwt token',
    }),
    ApiResponse({
      status: 200,
      description: 'login successful',
      type: LoginResBody,
    }),
    ApiBadRequest('nik harus diisi!', 'unfilled nik or password'),
    ApiUnauthorized('nik atau password salah!', 'invalid nik or password'),
    ApiResponse({
      status: 500,
      description: 'an unexpected error occurred',
      type: ServerErrorResBody,
    }),
  );
};

export const ApiValidateToken = (): MethodDecorator => {
  return applyDecorators(
    ApiOperation({
      summary: 'validate token',
      description: 'validate the provided jwt token',
    }),
    ApiResponse({
      status: 200,
      description: 'token is valid',
      type: ValidateTokenResBody,
    }),
    ApiBadRequest('token harus diisi!', 'unfilled token'),
    ApiUnauthorized('token tidak valid!', 'invalid token'),
    ApiResponse({
      status: 500,
      description: 'an unexpected error occurred',
      type: ServerErrorResBody,
    }),
  );
};
