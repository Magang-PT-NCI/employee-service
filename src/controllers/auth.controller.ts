import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import {
  LoginReqBody,
  LoginResBody,
  ValidateTokenReqBody,
  ValidateTokenResBody,
} from '../dto/auth.dto';
import { ApiLogin, ApiValidateToken } from '../decorators/api-auth.decorator';
import { ApiTags } from '@nestjs/swagger';
import { LoggerUtil } from '../utils/logger.utils';

@Controller()
@ApiTags('Auth')
export class AuthController {
  private readonly logger = new LoggerUtil('AuthController');

  public constructor(private readonly service: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiLogin()
  public async login(@Body() reqBody: LoginReqBody): Promise<LoginResBody> {
    this.logger.debug(`request body: `, reqBody);

    const { nik, password } = reqBody;

    if (!nik) {
      throw new BadRequestException('nik harus diisi!');
    }

    if (!password) {
      throw new BadRequestException('password harus diisi!');
    }

    return await this.service.handleLogin(nik, password);
  }

  @Post('validate_token')
  @HttpCode(HttpStatus.OK)
  @ApiValidateToken()
  public async validateToken(
    @Body() reqBody: ValidateTokenReqBody,
  ): Promise<ValidateTokenResBody> {
    this.logger.debug(`request body: `, reqBody);

    const { token } = reqBody;

    if (!token) {
      throw new BadRequestException('token harus diisi!');
    }

    return await this.service.handleValidateToken(token);
  }
}
