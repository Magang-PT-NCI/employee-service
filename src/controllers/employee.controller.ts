import { Controller, Get, Param } from '@nestjs/common';
import { EmployeeService } from '../services/employee.service';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get(':nik')
  async getEmployee(@Param('nik') nik: string): Promise<string> {
    return await this.employeeService.handleGetEmployee(nik);
  }
}
