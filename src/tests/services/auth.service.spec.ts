import { EmployeeModel } from '../../models/employee.model';
import { AuthService } from '../../services/auth.service';
import { compareSync } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { logger } from '../../utils/logger.utils';
import { SECRET_KEY } from '../../config/app.config';

jest.mock('../../models/employee.model');
jest.mock('../../utils/logger.utils');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('auth service test', () => {
  let service: AuthService;
  beforeEach(() => {
    service = new AuthService();
  });

  describe('handle login test', () => {
    it('should return null with invalid nik', async () => {
      const nik = '123';
      const password = 'abc';
      const employeeMock = { nik: '456', password };

      (EmployeeModel.get as jest.Mock).mockReturnValue(employeeMock);

      expect(await service.handleLogin(nik, password)).toBeNull();
      expect(EmployeeModel.get).toHaveBeenCalledWith(nik);
    });

    it('should return null with invalid password', async () => {
      const nik = '123';
      const password = 'abc';
      const employeeMock = { nik, password: 'def' };

      (EmployeeModel.get as jest.Mock).mockReturnValue(employeeMock);
      (compareSync as jest.Mock).mockReturnValue(false);

      expect(await service.handleLogin(nik, password)).toBeNull();
      expect(EmployeeModel.get).toHaveBeenCalledWith(nik);
      expect(compareSync).toHaveBeenCalledWith(password, employeeMock.password);
    });

    it('should return token for valid request', async () => {
      const nik = '123';
      const password = 'abc';
      const employeeMock = { nik, password, position: 'Onsite' };

      (EmployeeModel.get as jest.Mock).mockReturnValue(employeeMock);
      (compareSync as jest.Mock).mockReturnValue(true);
      (sign as jest.Mock).mockReturnValue('rahasia');

      const result = await service.handleLogin(nik, password);
      expect(result).not.toBeNull();
      expect(result.user_role).toBe(employeeMock.position);
      expect(result.token).toBe('rahasia');
      expect(EmployeeModel.get).toHaveBeenCalledWith(nik);
      expect(compareSync).toHaveBeenCalledWith(password, employeeMock.password);
    });
  });

  describe('validate token', () => {
    it('should return null for invalid token', async () => {
      const token = 'rahasia';

      (verify as jest.Mock).mockImplementation(() => {
        throw new Error();
      });

      const result = await service.validateToken(token);
      expect(verify).toHaveBeenCalledWith(token, SECRET_KEY);
      expect(logger.error).toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should return null for not exists employee', async () => {
      const token = 'rahasia';
      const tokenData = { nik: '123' };

      (verify as jest.Mock).mockReturnValue(tokenData);
      (EmployeeModel.get as jest.Mock).mockReturnValue(null);

      const result = await service.validateToken(token);
      expect(verify).toHaveBeenCalledWith(token, SECRET_KEY);
      expect(EmployeeModel.get).toHaveBeenCalledWith(tokenData.nik);
      expect(result).toBeNull();
    });

    it('should return employee data for valid token', async () => {
      const token = 'rahasia';
      const tokenData = { nik: '123' };
      const employeeMock = { nik: '123', name: 'abc' };

      (verify as jest.Mock).mockReturnValue(tokenData);
      (EmployeeModel.get as jest.Mock).mockReturnValue(employeeMock);

      const result = await service.validateToken(token);
      expect(verify).toHaveBeenCalledWith(token, SECRET_KEY);
      expect(EmployeeModel.get).toHaveBeenCalledWith(tokenData.nik);
      expect(result).toEqual(employeeMock);
    });
  });
});
