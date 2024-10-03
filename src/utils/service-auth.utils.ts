import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '../config/app.config';
import { TokenPayload } from '../types/auth.types';
import { logger } from './logger.utils';
import { PrismaClient } from '@prisma/client';
import { getPrismaClient } from './prisma.utils';
import { ApiKey } from '../interfaces/prisma.interfaces';

export class ServiceAuthUtils {
  public static validateToken(token: string): TokenPayload {
    try {
      return verify(token, SECRET_KEY) as TokenPayload;
    } catch (err) {
      logger.error(err);
      return null;
    }
  }

  public static async validateApiKey(apiKey: string): Promise<boolean> {
    const prisma: PrismaClient = getPrismaClient();
    const key: ApiKey = await prisma.apiKey.findFirst({
      where: { key: apiKey },
    });

    return key !== null;
  }
}
