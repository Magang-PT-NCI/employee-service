import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compareSync } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { SECRET_KEY } from '../config/app.config';
import { LoginResBody, ValidateTokenResBody } from '../dto/auth.dto';
import { EmployeeAuth, TokenPayload } from '../interfaces/auth.interfaces';
import { validateToken } from '../utils/common.utils';
import { LoggerUtil } from '../utils/logger.utils';
import { PrismaService } from './prisma.service';

@Injectable()
export class AuthService {
  private static readonly EMPLOYEE_SELECT = {
    nik: true,
    password: true,
    position: true,
    profile_photo: true,
  };

  private readonly logger = new LoggerUtil('AuthService');

  public constructor(private readonly prisma: PrismaService) {}

  public async handleLogin(
    nik: string,
    password: string,
  ): Promise<LoginResBody> {
    const employee: EmployeeAuth = await this.prisma.getEmployee(
      nik,
      AuthService.EMPLOYEE_SELECT,
    );

    const isPasswordValid: boolean = employee
      ? compareSync(password, employee.password)
      : false;

    if (!isPasswordValid) {
      throw new UnauthorizedException('nik atau password salah!');
    }

    const token = sign({ nik: employee.nik }, SECRET_KEY, { expiresIn: '1w' });

    return new LoginResBody(employee, token);
  }

  public async handleValidateToken(
    token: string,
  ): Promise<ValidateTokenResBody | null> {
    const tokenData: TokenPayload = validateToken(token, this.logger);

    if (!tokenData) {
      throw new UnauthorizedException('token tidak valid!');
    }

    const employee: EmployeeAuth = await this.prisma.getEmployee(
      tokenData.nik,
      AuthService.EMPLOYEE_SELECT,
    );

    if (!employee) {
      throw new UnauthorizedException('token tidak valid!');
    }

    return new ValidateTokenResBody(employee);
  }
}
