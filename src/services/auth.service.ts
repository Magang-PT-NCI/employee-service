import { Injectable } from '@nestjs/common';
import { EmployeeModel } from '../models/employee.model';
import { compareSync } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { SECRET_KEY } from '../config/app.config';
import { logger } from '../utils/logger.utils';
import { LoginResBody } from '../dto/auth.dto';
import { TokenPayload } from '../types/auth.types';

@Injectable()
export class AuthService {
  async handleLogin(nik: string, password: string): Promise<LoginResBody> {
    const employee: EmployeeModel = await EmployeeModel.get(nik);
    const isPasswordValid: boolean = employee
      ? compareSync(password, employee.password)
      : false;

    if (!isPasswordValid) {
      return null;
    }

    return {
      user_role: employee.position,
      token: sign({ nik: employee.nik }, SECRET_KEY, { expiresIn: '1w' }),
    };
  }

  async handleValidateToken(token: string): Promise<EmployeeModel> {
    let tokenData: TokenPayload;

    try {
      tokenData = verify(token, SECRET_KEY) as TokenPayload;
    } catch (err) {
      logger.error(err);
      return null;
    }

    const employee: EmployeeModel = await EmployeeModel.get(tokenData.nik);

    if (!employee) {
      return null;
    }

    return employee;
  }
}
