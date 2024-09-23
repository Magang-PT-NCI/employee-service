import {
  BadRequestException,
  Controller,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginRequest, TokenValidationRequest } from '../types/request.types';

@Controller()
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('login')
  async login(@Req() req: LoginRequest) {
    const { nik, password } = req.body;

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
  async validateToken(@Req() req: TokenValidationRequest) {
    const { token } = req.body;

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
