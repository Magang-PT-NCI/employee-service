import { Controller, Get, Param } from '@nestjs/common';
import { EmployeeService } from '../services/employee.service';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ApiEmployee } from '../decorators/api-employee.decorator';
import { EmployeeParams, EmployeeResBody } from '../dto/employee.dto';
import { ApiAllEmployee } from '../decorators/api-all-employee.decorator';

@Controller('employee')
@ApiTags('Employee')
@ApiSecurity('apiKey')
@ApiSecurity('jwt')
export class EmployeeController {
  public constructor(private readonly service: EmployeeService) {}

  @Get('')
  @ApiAllEmployee()
  public getAllEmployee(): Promise<EmployeeResBody[]> {
    return this.service.handleGetAllEmployee();
  }

  @Get(':nik')
  @ApiEmployee()
  public getEmployee(
    @Param() params: EmployeeParams,
  ): Promise<EmployeeResBody> {
    return this.service.handleGetEmployee(params.nik);
  }
}
