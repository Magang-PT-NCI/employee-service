import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { ApiKey, Employee, Prisma, PrismaClient } from '@prisma/client';
import { LoggerUtil } from '../utils/logger.utils';
import { EmployeeService } from './employee.service';
import { EmployeeResBody } from '../dto/employee.dto';
import { handleError } from '../utils/common.utils';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new LoggerUtil('PrismaService');

  public async onModuleInit() {
    await this.$connect();
    this.logger.info('Database is connected');
  }

  public async onModuleDestroy() {
    await this.$disconnect();
    this.logger.info('Database is disconnected');
  }

  public async getEmployee(
    nik: string,
    select?: Prisma.EmployeeSelect,
  ): Promise<Employee> {
    try {
      return await this.employee.findUnique({
        where: { nik },
        select,
      });
    } catch (error) {
      handleError(error, this.logger);
    }
  }

  public async getAllEmployee(): Promise<EmployeeResBody[]> {
    try {
      return await this.employee.findMany({
        select: EmployeeService.EMPLOYEE_SELECT,
      });
    } catch (error) {
      handleError(error, this.logger);
    }
  }

  public async getApiKey(key: string): Promise<ApiKey> {
    try {
      return await this.apiKey.findFirst({
        where: { key },
      });
    } catch (error) {
      handleError(error, this.logger);
    }
  }
}
