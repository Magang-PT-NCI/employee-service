import { Injectable, NotFoundException } from '@nestjs/common';
import { EmployeeResBody } from '../dto/employee.dto';
import { PrismaService } from './prisma.service';

@Injectable()
export class EmployeeService {
  constructor(private readonly prisma: PrismaService) {}

  public async handleGetEmployee(nik: string): Promise<EmployeeResBody> {
    const employee: EmployeeResBody = await this.prisma.getEmployee(nik, {
      nik: true,
      name: true,
      area: true,
      role: true,
      position: true,
    });

    if (!employee) {
      throw new NotFoundException('karyawan tidak ditemukan!');
    }

    return employee;
  }
}
