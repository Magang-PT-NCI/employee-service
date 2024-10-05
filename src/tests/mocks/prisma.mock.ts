export const getEmployee = jest.fn();
export const getApiKey = jest.fn();

// Mock the PrismaClient
jest.mock('../../services/prisma.service', () => {
  return {
    PrismaService: jest.fn().mockImplementation(() => {
      return {
        getEmployee,
        getApiKey,
      };
    }),
  };
});
