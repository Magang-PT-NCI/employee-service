// Mock the winston logger
jest.mock('winston', () => {
  const mockLogger = {
    debug: jest.fn(),
    http: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
  };

  return {
    createLogger: jest.fn(() => mockLogger),
    format: {
      printf: jest.fn(),
    },
    transports: {
      Console: jest.fn(),
      File: jest.fn(),
    },
  };
});

// Mock dependencies
jest.mock('../../config/logger.config', () => ({
  DESTINATION: 'logs/app.log',
  FILE_FLAG: 'w',
  LEVEL: 'debug',
  TRANSPORT: 'console',
}));
jest.mock('../../utils/date.utils', () => ({
  getDateFormat: jest.fn(() => '10:00:00.000'),
}));
