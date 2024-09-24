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
import { LoginReqBody, ValidateTokenReqBody } from '../dto/auth.dto';
import { ApiLogin, ApiValidateToken } from '../decorators/api-auth.decorator';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiLogin()
  async login(@Body() reqBody: LoginReqBody) {
    logger.debug(`request body: ${logFormat(reqBody)}`);

    const { nik, password } = reqBody;

    if (!nik) {
      throw new BadRequestException('nik harus diisi!');
    }

    if (!password) {
      throw new BadRequestException('password harus diisi!');
    }

    const result = await this.service.handleLogin(nik, password);

    if (!result) {
      throw new UnauthorizedException('nik atau password salah!');
    }

    return result;
  }

  @Post('validate_token')
  @HttpCode(HttpStatus.OK)
  @ApiValidateToken()
  async validateToken(@Body() reqBody: ValidateTokenReqBody) {
    logger.debug(`request body: ${logFormat(reqBody)}`);

    const { token } = reqBody;

    if (!token) {
      throw new BadRequestException('token harus diisi!');
    }

    const employee = await this.service.handleValidateToken(token);

    if (!employee) {
      throw new UnauthorizedException('token tidak valid!');
    }

    return {
      nik: employee.nik,
      profile_photo: employee.getProfilePhoto(),
    };
  }
}
