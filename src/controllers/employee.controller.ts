import { Controller, Get, Param } from '@nestjs/common';
import { EmployeeService } from '../services/employee.service';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ApiEmployee } from '../decorators/api-employee.decorator';
import { EmployeeParams, EmployeeResBody } from '../dto/employee.dto';

@Controller('employee')
@ApiTags('Employee')
@ApiSecurity('apiKey')
export class EmployeeController {
  constructor(private readonly service: EmployeeService) {}

  @Get(':nik')
  @ApiEmployee()
  async getEmployee(@Param() params: EmployeeParams): Promise<EmployeeResBody> {
    return await this.service.handleGetEmployee(params.nik);
  }
}
