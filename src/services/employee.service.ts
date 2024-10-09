import { Injectable, NotFoundException } from '@nestjs/common';
import { EmployeeResBody } from '../dto/employee.dto';
import { PrismaService } from './prisma.service';

@Injectable()
export class EmployeeService {
  public static readonly EMPLOYEE_SELECT = {
    nik: true,
    name: true,
    area: true,
    role: true,
    position: true,
  };

  constructor(private readonly prisma: PrismaService) {}

  public async handleGetAllEmployee(): Promise<EmployeeResBody[]> {
    return await this.prisma.getAllEmployee();
  }

  public async handleGetEmployee(nik: string): Promise<EmployeeResBody> {
    const employee: EmployeeResBody = await this.prisma.getEmployee(
      nik,
      EmployeeService.EMPLOYEE_SELECT,
    );

    if (!employee) {
      throw new NotFoundException('karyawan tidak ditemukan!');
    }

    return employee;
  }
}
