import { AuthController } from '../../controllers/auth.controller';
import { AuthService } from '../../services/auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import {
  LoginReqBody,
  ValidateTokenReqBody,
  ValidateTokenResBody,
} from '../../dto/auth.dto';

describe('auth controller test', () => {
  let mockRequest: Partial<Request>;
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            handleLogin: jest.fn(),
            handleValidateToken: jest.fn(),
          },
        },
      ],
    }).compile();

    mockRequest = { body: {} };

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  describe('login test', () => {
    it('should throw BadRequestException for unprovided nik', async () => {
      mockRequest.body.password = 'abc';

      await expect(
        controller.login(mockRequest.body as LoginReqBody),
      ).rejects.toThrow(new BadRequestException('nik harus diisi!'));
    });

    it('should throw BadRequestException for unprovided password', async () => {
      mockRequest.body.nik = '123';

      await expect(
        controller.login(mockRequest.body as LoginReqBody),
      ).rejects.toThrow(new BadRequestException('password harus diisi!'));
    });

    it('should throw UnauthorizedException for invalid nik or password', async () => {
      const error = new UnauthorizedException('nik atau password salah!');

      mockRequest.body.nik = '123';
      mockRequest.body.password = 'abc';

      (service.handleLogin as jest.Mock).mockRejectedValue(error);

      await expect(
        controller.login(mockRequest.body as LoginReqBody),
      ).rejects.toThrow(error);
      expect(service.handleLogin).toHaveBeenCalledWith(
        mockRequest.body.nik,
        mockRequest.body.password,
      );
    });

    it('should success perform login', async () => {
      mockRequest.body.nik = '123';
      mockRequest.body.password = 'abc';

      const mockResult = {
        user_role: 'OnSite',
        token: 'xyz',
      };

      (service.handleLogin as jest.Mock).mockReturnValue(mockResult);

      const result = await controller.login(mockRequest.body as LoginReqBody);
      expect(result).toEqual(mockResult);
      expect(service.handleLogin).toHaveBeenCalledWith(
        mockRequest.body.nik,
        mockRequest.body.password,
      );
    });
  });

  describe('token validation test', () => {
    it('should throw BadRequestException when token is not provided', async () => {
      await expect(
        controller.validateToken(mockRequest.body as ValidateTokenReqBody),
      ).rejects.toThrow(new BadRequestException('token harus diisi!'));
    });

    it('should throw UnauthorizedException when token is not valid', async () => {
      const error = new UnauthorizedException('token tidak valid!');
      mockRequest.body.token = 'abc';

      (service.handleValidateToken as jest.Mock).mockRejectedValue(error);

      await expect(
        controller.validateToken(mockRequest.body as ValidateTokenReqBody),
      ).rejects.toThrow(error);
      expect(service.handleValidateToken).toHaveBeenCalledWith(
        mockRequest.body.token,
      );
    });

    it('should success to validate token', async () => {
      mockRequest.body.token = 'abc';

      const employee: ValidateTokenResBody = {
        nik: '123456789',
        user_role: 'OnSite',
        profile_photo: 'http://localhost:3000/files/default.png',
      };

      (service.handleValidateToken as jest.Mock).mockReturnValue(employee);

      const result = await controller.validateToken(
        mockRequest.body as ValidateTokenReqBody,
      );
      expect(service.handleValidateToken).toHaveBeenCalledWith(
        mockRequest.body.token,
      );
      expect(result).toEqual(employee);
    });
  });
});
