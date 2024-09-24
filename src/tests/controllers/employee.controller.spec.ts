import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeController } from '../../controllers/employee.controller';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeParams } from '../../dto/employee.dto';

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
    const params: EmployeeParams = { nik: '123456' };
    const mockEmployeeData = { name: 'John Doe' };

    (service.handleGetEmployee as jest.Mock).mockResolvedValue(
      mockEmployeeData,
    );

    const result = await controller.getEmployee(params);

    expect(result).toEqual(mockEmployeeData);
    expect(service.handleGetEmployee).toHaveBeenCalledWith(params.nik);
  });
});
