import { Controller, Get, Param } from '@nestjs/common';
import { EmployeeService } from '../services/employee.service';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly service: EmployeeService) {}

  @Get(':nik')
  async getEmployee(@Param('nik') nik: string) {
    return await this.service.handleGetEmployee(nik);
  }
}
