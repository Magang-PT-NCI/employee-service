import { TokenExpiredError, verify } from 'jsonwebtoken';
import { SECRET_KEY } from '../config/app.config';
import { TokenPayload } from '../interfaces/auth.interfaces';
import { LoggerUtil } from './logger.utils';
import { HttpException, InternalServerErrorException } from '@nestjs/common';

export const handleError = (error: Error, logger: LoggerUtil) => {
  if (error instanceof HttpException) {
    throw error;
  }

  logger.error(error);
  throw new InternalServerErrorException();
};

export const zeroPadding = (numText: string | number, length: number = 2) => {
  return `${numText}`.padStart(length, '0');
};

export const validateToken = (token: string): TokenPayload => {
  try {
    return verify(token, SECRET_KEY) as TokenPayload;
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return null;
    }

    handleError(err, LoggerUtil.getInstance('ValidateToken'));
  }
};

export const getPhotoUrl = (id: string) => {
  return `https://lh3.googleusercontent.com/d/${id}=s220`;
};
