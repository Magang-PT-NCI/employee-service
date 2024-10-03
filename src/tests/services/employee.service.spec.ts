import { NotFoundException } from '@nestjs/common';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeModel } from '../../models/employee.model';

jest.mock('../../models/employee.model'); // Mocking the EmployeeModel

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
});
