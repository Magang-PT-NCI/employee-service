import { Injectable } from '@nestjs/common';
import { EmployeeModel } from '../models/employee.model';
import { compareSync } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { SECRET_KEY } from '../config/app.config';
import { LoginResBody } from '../dto/auth.dto';
import { TokenPayload } from '../types/auth.types';
import { ServiceAuthUtils } from '../utils/service-auth.utils';

@Injectable()
export class AuthService {
  public async handleLogin(
    nik: string,
    password: string,
  ): Promise<LoginResBody> {
    const employee: EmployeeModel = await EmployeeModel.get(nik);
    const isPasswordValid: boolean = employee
      ? compareSync(password, employee.password)
      : false;

    if (!isPasswordValid) {
      return null;
    }

    return {
      nik: employee.nik,
      user_role: employee.position,
      profile_photo: employee.getProfilePhoto(),
      token: sign({ nik: employee.nik }, SECRET_KEY, { expiresIn: '1w' }),
    };
  }

  public async handleValidateToken(token: string): Promise<EmployeeModel> {
    const tokenData: TokenPayload = ServiceAuthUtils.validateToken(token);

    if (!tokenData) {
      return null;
    }

    const employee: EmployeeModel = await EmployeeModel.get(tokenData.nik);

    if (!employee) {
      return null;
    }

    return employee;
  }
}
