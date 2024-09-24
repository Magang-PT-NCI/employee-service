import { NotFoundException } from '@nestjs/common';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeModel } from '../../models/employee.model';
import { getPrismaClient } from '../../utils/prisma.utils';

jest.mock('../../models/employee.model'); // Mocking the EmployeeModel
jest.mock('../../utils/prisma.utils');

describe('employee service test', () => {
  let service: EmployeeService;

  beforeEach(() => {
    service = new EmployeeService();
  });

  it('should return employee data when employee is found', async () => {
    const nik = '123456';
    const mockEmployee = {
      getResData: jest.fn().mockReturnValue({ name: 'John Doe' }),
    };

    (EmployeeModel.get as jest.Mock).mockResolvedValue(mockEmployee);

    const result = await service.handleGetEmployee(nik);

    expect(result).toEqual({ name: 'John Doe' });
    expect(EmployeeModel.get).toHaveBeenCalledWith(nik);
  });

  it('should throw NotFoundException when employee is not found', async () => {
    const nik = '999999';

    (EmployeeModel.get as jest.Mock).mockResolvedValue(null);

    await expect(service.handleGetEmployee(nik)).rejects.toThrow(
      new NotFoundException('karyawan tidak ditemukan!'),
    );
    expect(EmployeeModel.get).toHaveBeenCalledWith(nik);
  });

  it('should return correct value for api key validation', async () => {
    const apiKey = 'abc';
    const prismaMock = {
      apiKey: { findFirst: jest.fn() },
    };

    prismaMock.apiKey.findFirst.mockReturnValueOnce({
      id: 1,
      key: apiKey,
    });
    prismaMock.apiKey.findFirst.mockReturnValueOnce(null);

    (getPrismaClient as jest.Mock).mockReturnValue(prismaMock);

    [true, false].forEach((valid) => {
      expect(service.verifyApiKey(apiKey)).resolves.toBe(valid);
      expect(getPrismaClient).toHaveBeenCalled();
      expect(prismaMock.apiKey.findFirst).toHaveBeenCalledWith({
        where: { key: apiKey },
      });
    });
  });
});
