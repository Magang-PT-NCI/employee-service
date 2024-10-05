import { Injectable, NotFoundException } from '@nestjs/common';
import { EmployeeModel } from '../models/employee.model';
import { EmployeeResBody } from '../dto/employee.dto';
import { Employee } from '../interfaces/prisma.interfaces';
import { PrismaClient } from '@prisma/client';
import { getPrismaClient } from 'src/utils/prisma.utils';

@Injectable()
export class EmployeeService {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = getPrismaClient();
  }

  public async handleGetEmployee(nik: string): Promise<EmployeeResBody> {
    const employee: EmployeeModel = await EmployeeModel.get(nik);

    if (!employee) {
      throw new NotFoundException('karyawan tidak ditemukan!');
    }

    return employee.getResData();
  }

  public async getEmployee(nik: string): Promise<Employee> {
    const result: Employee = await this.prisma.employee.findUnique({
      where: { nik },
    });

    if (!result) {
      return null;
    }
  }
}
