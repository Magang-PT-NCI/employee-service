import { Injectable, NotFoundException } from '@nestjs/common';
import { EmployeeModel } from '../models/employee.model';
import { getPrismaClient } from '../utils/prisma.utils';

@Injectable()
export class EmployeeService {
  async handleGetEmployee(nik: string) {
    const employee = await EmployeeModel.get(nik);

    if (!employee) {
      throw new NotFoundException('karyawan tidak ditemukan!');
    }

    return employee.toJson();
  }

  async verifyApiKey(apiKey: string) {
    if (!apiKey) {
      return false;
    }

    const prisma = getPrismaClient();
    const key = await prisma.apiKey.findFirst({
      where: { key: apiKey },
    });

    return key !== null;
  }
}
