import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compareSync } from 'bcrypt';
import { LoginResBody, ValidateTokenResBody } from '../dto/auth.dto';
import { EmployeeAuth, TokenPayload } from '../interfaces/auth.interfaces';
import { validateToken } from '../utils/common.utils';
import { PrismaService } from './prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  private static readonly AUTH_EMPLOYEE_SELECT: Prisma.EmployeeSelect = {
    nik: true,
    password: true,
    position: true,
    profile_photo: true,
  };

  public constructor(private readonly prisma: PrismaService) {}

  public async handleLogin(
    nik: string,
    password: string,
  ): Promise<LoginResBody> {
    const employee: EmployeeAuth = await this.prisma.getEmployee(
      nik,
      AuthService.AUTH_EMPLOYEE_SELECT,
    );

    const isPasswordValid: boolean = employee
      ? compareSync(password, employee.password)
      : false;

    if (!isPasswordValid) {
      throw new UnauthorizedException('nik atau password salah!');
    }

    return new LoginResBody(employee);
  }

  public async handleValidateToken(
    token: string,
  ): Promise<ValidateTokenResBody> {
    const tokenData: TokenPayload = validateToken(token);

    if (!tokenData) {
      throw new UnauthorizedException('token tidak valid!');
    }

    const employee: EmployeeAuth = await this.prisma.getEmployee(
      tokenData.nik,
      AuthService.AUTH_EMPLOYEE_SELECT,
    );

    if (!employee) {
      throw new UnauthorizedException('token tidak valid!');
    }

    return new ValidateTokenResBody(employee);
  }
}
