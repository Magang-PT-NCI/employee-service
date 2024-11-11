import { getAllEmployee, getEmployee } from '../mocks/prisma.mock';

import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EmployeeService } from '../../services/employee.service';
import { PrismaService } from '../../services/prisma.service';

describe('employee service test', () => {
  const employeeSelect = {
    nik: true,
    name: true,
    area: true,
    role: true,
    position: true,
  };

  let service: EmployeeService;
  let prisma: PrismaService;

  beforeEach(() => {
    prisma = new PrismaService();
    service = new EmployeeService(prisma);
  });

  it('should return all employee data', async () => {
    const mockEmployee = [{ name: 'John Doe' }];

    getAllEmployee.mockResolvedValue(mockEmployee);

    const result = await service.handleGetAllEmployee();

    expect(result).toEqual(mockEmployee);
    expect(getAllEmployee).toHaveBeenCalled();
  });

  it('should return employee data when employee is found', async () => {
    const nik = '123456';
    const mockEmployee = { name: 'John Doe' };

    getEmployee.mockResolvedValue(mockEmployee);

    const result = await service.handleGetEmployee(nik);

    expect(result).toEqual({ name: 'John Doe' });
    expect(getEmployee).toHaveBeenCalledWith(nik, employeeSelect);
  });

  it('should throw NotFoundException when employee is not found', async () => {
    const nik = '999999';

    getEmployee.mockResolvedValue(null);

    await expect(service.handleGetEmployee(nik)).rejects.toThrow(
      new NotFoundException('karyawan tidak ditemukan!'),
    );
    expect(getEmployee).toHaveBeenCalledWith(nik, employeeSelect);
  });

  it('should throw InternalServerError when prisma is error', async () => {
    const nik = '999999';

    getEmployee.mockRejectedValue(new InternalServerErrorException());

    await expect(service.handleGetEmployee(nik)).rejects.toThrow(
      new InternalServerErrorException(),
    );
    expect(getEmployee).toHaveBeenCalledWith(nik, employeeSelect);
  });
});
