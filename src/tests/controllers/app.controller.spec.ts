import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeController } from '../../controllers/employee.controller';
import { EmployeeService } from '../../services/employee.service';
import { NotFoundException } from '@nestjs/common';

describe('employee controller test', () => {
  let controller: EmployeeController;
  let service: EmployeeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeController],
      providers: [
        {
          provide: EmployeeService,
          useValue: {
            handleGetEmployee: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<EmployeeController>(EmployeeController);
    service = module.get<EmployeeService>(EmployeeService);
  });

  it('should return employee data when found', async () => {
    const nik = '123456';
    const mockEmployeeData = { name: 'John Doe' };

    (service.handleGetEmployee as jest.Mock).mockResolvedValue(
      mockEmployeeData,
    );

    const result = await controller.getEmployee(nik);

    expect(result).toEqual(mockEmployeeData);
    expect(service.handleGetEmployee).toHaveBeenCalledWith(nik);
  });

  it('should throw NotFoundException when employee is not found', async () => {
    const nik = '999999';

    (service.handleGetEmployee as jest.Mock).mockRejectedValue(
      new NotFoundException('Karyawan tidak ditemukan!'),
    );

    await expect(controller.getEmployee(nik)).rejects.toThrow(
      NotFoundException,
    );
    await expect(controller.getEmployee(nik)).rejects.toThrow(
      'Karyawan tidak ditemukan!',
    );
  });
});
