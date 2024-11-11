export const getAllEmployee = jest.fn();
export const getEmployee = jest.fn();
export const getApiKey = jest.fn();

// Mock the PrismaClient
jest.mock('../../services/prisma.service', () => {
  return {
    PrismaService: jest.fn().mockImplementation(() => {
      return {
        getAllEmployee,
        getEmployee,
        getApiKey,
      };
    }),
  };
});
