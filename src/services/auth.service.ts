import { Injectable } from '@nestjs/common';
import { EmployeeModel } from '../models/employee.model';
import { compareSync } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { SECRET_KEY } from '../config/app.config';
import { logger } from '../utils/logger.utils';
import { LoginResBody } from '../dto/auth.dto';

@Injectable()
export class AuthService {
  async handleLogin(nik: string, password: string) {
    const employee = await EmployeeModel.get(nik);
    const isPasswordValid = employee
      ? compareSync(password, employee.password)
      : false;

    if (!isPasswordValid) {
      return null;
    }

    return {
      user_role: employee.position,
      token: sign({ nik: employee.nik }, SECRET_KEY, { expiresIn: '1w' }),
    } as LoginResBody;
  }

  async handleValidateToken(token: string) {
    let tokenData: { nik: string };

    try {
      tokenData = verify(token, SECRET_KEY) as { nik: string };
    } catch (err) {
      logger.error(err);
      return null;
    }

    const employee = await EmployeeModel.get(tokenData.nik);

    if (!employee) {
      return null;
    }

    return employee;
  }
}
