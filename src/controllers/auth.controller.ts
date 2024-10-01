import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { logFormat, logger } from '../utils/logger.utils';
import {
  LoginReqBody,
  LoginResBody,
  ValidateTokenReqBody,
  ValidateTokenResBody,
} from '../dto/auth.dto';
import { ApiLogin, ApiValidateToken } from '../decorators/api-auth.decorator';
import { ApiTags } from '@nestjs/swagger';
import { EmployeeModel } from '../models/employee.model';

@Controller()
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiLogin()
  async login(@Body() reqBody: LoginReqBody): Promise<LoginResBody> {
    logger.debug(`request body: ${logFormat(reqBody)}`);

    const { nik, password } = reqBody;

    if (!nik) {
      throw new BadRequestException('nik harus diisi!');
    }

    if (!password) {
      throw new BadRequestException('password harus diisi!');
    }

    const result: LoginResBody = await this.service.handleLogin(nik, password);

    if (!result) {
      throw new UnauthorizedException('nik atau password salah!');
    }

    return result;
  }

  @Post('validate_token')
  @HttpCode(HttpStatus.OK)
  @ApiValidateToken()
  async validateToken(
    @Body() reqBody: ValidateTokenReqBody,
  ): Promise<ValidateTokenResBody> {
    logger.debug(`request body: ${logFormat(reqBody)}`);

    const { token } = reqBody;

    if (!token) {
      throw new BadRequestException('token harus diisi!');
    }

    const employee: EmployeeModel =
      await this.service.handleValidateToken(token);

    if (!employee) {
      throw new UnauthorizedException('token tidak valid!');
    }

    return {
      nik: employee.nik,
      profile_photo: employee.getProfilePhoto(),
      user_role: employee.position,
    } as ValidateTokenResBody;
  }
}
