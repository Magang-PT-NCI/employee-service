import { Injectable, NotFoundException } from '@nestjs/common';
import { EmployeeModel } from '../models/employee.model';
import { EmployeeResBody } from '../dto/employee.dto';

@Injectable()
export class EmployeeService {
  async handleGetEmployee(nik: string): Promise<EmployeeResBody> {
    const employee: EmployeeModel = await EmployeeModel.get(nik);

    if (!employee) {
      throw new NotFoundException('karyawan tidak ditemukan!');
    }

    return employee.getResData();
  }
}
