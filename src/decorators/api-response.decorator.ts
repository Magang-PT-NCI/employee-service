import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ErrorResBody } from '../dto/api-error.dto';

const createApiResponseDecorator = (
  status: number,
  error: string,
  description: string,
  message: string,
) => {
  const example = {
    message,
    error,
    statusCode: status,
  };

  return applyDecorators(
    ApiResponse({
      status,
      description,
      type: ErrorResBody,
      example,
    }),
  );
};

export const ApiBadRequest = (message: string, description = 'bad request') =>
  createApiResponseDecorator(
    HttpStatus.BAD_REQUEST,
    'Bad Request',
    description,
    message,
  );

export const ApiUnauthorized = (
  message: string,
  description = 'unauthorized',
) =>
  createApiResponseDecorator(
    HttpStatus.UNAUTHORIZED,
    'Unauthorized',
    description,
    message,
  );

export const ApiNotFound = (message: string, description = 'not found') =>
  createApiResponseDecorator(
    HttpStatus.NOT_FOUND,
    'Not Found',
    description,
    message,
  );
