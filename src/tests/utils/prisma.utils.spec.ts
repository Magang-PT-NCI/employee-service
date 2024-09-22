import { PrismaClient } from '@prisma/client';
import { getPrismaClient } from '../../utils/prisma.utils';

describe('prisma utility test', () => {
  it('should return prisma client object', () => {
    expect(getPrismaClient()).toBeInstanceOf(PrismaClient);
  });
});
