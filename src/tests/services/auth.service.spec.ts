import { logger } from '../mocks/logger.mock';
import { getEmployee } from '../mocks/prisma.mock';

import { AuthService } from '../../services/auth.service';
import { compareSync } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { SECRET_KEY } from '../../config/app.config';
import { PrismaService } from '../../services/prisma.service';
import {
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginResBody, ValidateTokenResBody } from '../../dto/auth.dto';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('auth service test', () => {
  const employeeSelect = {
    nik: true,
    password: true,
    position: true,
    profile_photo: true,
  };

  let service: AuthService;
  let prisma: PrismaService;

  beforeEach(() => {
    prisma = new PrismaService();
    service = new AuthService(prisma);
  });

  describe('handle login test', () => {
    it('should throw Unauthorized with invalid nik', async () => {
      const nik = '123';
      const password = 'abc';
      const error = new UnauthorizedException('nik atau password salah!');

      await expect(service.handleLogin(nik, password)).rejects.toThrow(error);
      expect(getEmployee).toHaveBeenCalledWith(nik, employeeSelect);
    });

    it('should throw Unauthorized with invalid password', async () => {
      const nik = '123';
      const password = 'abc';
      const error = new UnauthorizedException('nik atau password salah!');

      getEmployee.mockReturnValue({ nik, password });
      (compareSync as jest.Mock).mockReturnValue(false);

      await expect(service.handleLogin(nik, password)).rejects.toThrow(error);

      expect(getEmployee).toHaveBeenCalledWith(nik, employeeSelect);
      expect(compareSync).toHaveBeenCalledWith(password, password);
    });

    it('should return LoginResBody for valid request', async () => {
      const nik = '123';
      const password = 'abc';
      const employeeMock = {
        nik,
        password,
        position: 'Onsite',
        profile_photo: 'default.png',
      };

      getEmployee.mockReturnValue(employeeMock);
      (compareSync as jest.Mock).mockReturnValue(true);
      (sign as jest.Mock).mockReturnValue('rahasia');

      const result = await service.handleLogin(nik, password);
      expect(result).toEqual(new LoginResBody(employeeMock));
      expect(getEmployee).toHaveBeenCalledWith(nik, employeeSelect);
      expect(compareSync).toHaveBeenCalledWith(password, employeeMock.password);
    });

    it('should throw InternalServerError when prisma is error', async () => {
      const nik = '123';
      const password = 'abc';

      getEmployee.mockRejectedValue(new InternalServerErrorException());
      await expect(service.handleLogin(nik, password)).rejects.toThrow(
        new InternalServerErrorException(),
      );

      expect(getEmployee).toHaveBeenCalledWith(nik, employeeSelect);
    });
  });

  describe('handle validate token test', () => {
    it('should throw Unauthorized for invalid token', async () => {
      const token = 'rahasia';

      (verify as jest.Mock).mockImplementation(() => {
        throw new Error();
      });

      await expect(service.handleValidateToken(token)).rejects.toThrow(
        new UnauthorizedException('token tidak valid!'),
      );
      expect(verify).toHaveBeenCalledWith(token, SECRET_KEY);
      expect(logger.error).toHaveBeenCalled();
    });

    it('should throw Unauthorized for not exists employee', async () => {
      const token = 'rahasia';
      const tokenData = { nik: '123' };

      (verify as jest.Mock).mockReturnValue(tokenData);
      getEmployee.mockReturnValue(null);

      await expect(service.handleValidateToken(token)).rejects.toThrow(
        new UnauthorizedException('token tidak valid!'),
      );
      expect(verify).toHaveBeenCalledWith(token, SECRET_KEY);
      expect(getEmployee).toHaveBeenCalledWith(tokenData.nik, employeeSelect);
    });

    it('should return employee data for valid token', async () => {
      const token = 'rahasia';
      const tokenData = { nik: '123' };
      const employeeMock = {
        nik: '123',
        password: 'ucup',
        position: 'Onsite',
        profile_photo: 'default.png',
      };

      (verify as jest.Mock).mockReturnValue(tokenData);
      getEmployee.mockReturnValue(employeeMock);

      const result = await service.handleValidateToken(token);
      expect(verify).toHaveBeenCalledWith(token, SECRET_KEY);
      expect(getEmployee).toHaveBeenCalledWith(tokenData.nik, employeeSelect);
      expect(result).toEqual(new ValidateTokenResBody(employeeMock));
    });
  });

  it('should throw InternalServerError when prisma is error', async () => {
    const token = 'rahasia';
    const tokenData = { nik: '123' };

    (verify as jest.Mock).mockReturnValue(tokenData);
    getEmployee.mockRejectedValue(new InternalServerErrorException());

    await expect(service.handleValidateToken(token)).rejects.toThrow(
      new InternalServerErrorException(),
    );

    expect(verify).toHaveBeenCalledWith(token, SECRET_KEY);
    expect(getEmployee).toHaveBeenCalledWith(tokenData.nik, employeeSelect);
  });
});
