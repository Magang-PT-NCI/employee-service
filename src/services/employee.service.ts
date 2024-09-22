import { Injectable, NotFoundException } from '@nestjs/common';
import { EmployeeModel } from '../models/employee.model';

@Injectable()
export class EmployeeService {
  async handleGetEmployee(nik: string): Promise<string> {
    const employee = await EmployeeModel.get(nik);

    if (!employee) {
      throw new NotFoundException('Karyawan tidak ditemukan!');
    }

    return employee.toJson();
  }
}
