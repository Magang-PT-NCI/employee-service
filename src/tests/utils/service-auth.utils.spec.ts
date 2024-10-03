import { verify } from 'jsonwebtoken';
import { ServiceAuthUtils } from '../../utils/service-auth.utils';
import { TokenPayload } from '../../types/auth.types';
import { logger } from '../../utils/logger.utils';
import { getPrismaClient } from '../../utils/prisma.utils';
import { ApiKey } from '../../interfaces/prisma.interfaces';

jest.mock('jsonwebtoken');
jest.mock('../../utils/logger.utils');
jest.mock('../../utils/prisma.utils');

describe('service auth utility test', () => {
  describe('validate token', () => {
    it('should return null for invalid token', () => {
      (verify as jest.Mock).mockImplementation(() => {
        throw new Error();
      });

      expect(ServiceAuthUtils.validateToken('abc')).toBeNull();
      expect(logger.error).toHaveBeenCalledWith(new Error());
    });

    it('should return token payload data for valid token', () => {
      const mockTokenPayload: TokenPayload = {
        nik: '001230045600701',
      };

      (verify as jest.Mock).mockReturnValue(mockTokenPayload);
      expect(ServiceAuthUtils.validateToken('abc')).toBe(mockTokenPayload);
    });
  });

  describe('validate api key', () => {
    beforeAll(() => {
      const mockPrisma = {
        apiKey: { findFirst: jest.fn() },
      };
      (getPrismaClient as jest.Mock).mockReturnValue(mockPrisma);
    });

    it('should return false for invalid api key', async () => {
      (getPrismaClient().apiKey.findFirst as jest.Mock).mockResolvedValue(null);
      expect(await ServiceAuthUtils.validateApiKey('abc')).toBe(false);
      expect(getPrismaClient).toHaveBeenCalled();
      expect(getPrismaClient().apiKey.findFirst).toHaveBeenCalledWith({
        where: { key: 'abc' },
      });
    });

    it('should return true for invalid api key', async () => {
      const mockApiKey: ApiKey = { id: 1, key: 'abc' };
      (getPrismaClient().apiKey.findFirst as jest.Mock).mockResolvedValue(
        mockApiKey,
      );

      expect(await ServiceAuthUtils.validateApiKey(mockApiKey.key)).toBe(true);
      expect(getPrismaClient).toHaveBeenCalled();
      expect(getPrismaClient().apiKey.findFirst).toHaveBeenCalledWith({
        where: { key: mockApiKey.key },
      });
    });
  });
});
