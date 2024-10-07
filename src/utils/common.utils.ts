import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '../config/app.config';
import { TokenPayload } from '../interfaces/auth.interfaces';
import { LoggerUtil } from './logger.utils';

export const zeroPadding = (numText: string | number, length: number = 2) => {
  return `${numText}`.padStart(length, '0');
};

export const validateToken = (token: string): TokenPayload => {
  try {
    return verify(token, SECRET_KEY) as TokenPayload;
  } catch (err) {
    LoggerUtil.getInstance('ValidateToken').error(err);
    return null;
  }
};

export const getPhotoUrl = (id: string) => {
  return `https://lh3.googleusercontent.com/d/${id}=s220`;
};
