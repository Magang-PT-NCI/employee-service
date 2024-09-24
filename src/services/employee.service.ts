import { Injectable, NotFoundException } from '@nestjs/common';
import { EmployeeModel } from '../models/employee.model';
import { getPrismaClient } from '../utils/prisma.utils';
import { EmployeeResBody } from '../dto/employee.dto';
import { PrismaClient } from '@prisma/client';
import { ApiKey } from '../interfaces/prisma.interfaces';

@Injectable()
export class EmployeeService {
  async handleGetEmployee(nik: string): Promise<EmployeeResBody> {
    const employee: EmployeeModel = await EmployeeModel.get(nik);

    if (!employee) {
      throw new NotFoundException('karyawan tidak ditemukan!');
    }

    return employee.getResData();
  }

  async verifyApiKey(apiKey: string): Promise<boolean> {
    if (!apiKey) {
      return false;
    }

    const prisma: PrismaClient = getPrismaClient();
    const key: ApiKey = await prisma.apiKey.findFirst({
      where: { key: apiKey },
    });

    return key !== null;
  }
}
