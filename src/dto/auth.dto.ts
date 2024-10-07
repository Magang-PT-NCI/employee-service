import { ApiProperty } from '@nestjs/swagger';
import { EmployeeAuth } from '../interfaces/auth.interfaces';
import { getPhotoUrl } from '../utils/common.utils';
import { SECRET_KEY } from '../config/app.config';
import { sign } from 'jsonwebtoken';

export class ValidateTokenReqBody {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkkujCJ9.eyJuaWsiOiIwMDEhugewNDU2MDA3MDEiLCJpYXQiOjE3MjcxMzczNjAsImV4cCI6MTcyNzc0MjE2MH0.uGwjj2AmJwJJ77QuZFf6nccBjkpbyW29Q2s0_69jjiE',
  })
  public readonly token: string;
}

export class ValidateTokenResBody {
  @ApiProperty({ example: '001230045600701' })
  public readonly nik: string;

  @ApiProperty({ example: 'OnSite' })
  public readonly user_role: string;

  @ApiProperty({
    example:
      'https://lh3.googleusercontent.com/d/22ZximVkuhxCuS_j_Vve2CKTyHiju0aY=s220',
  })
  public readonly profile_photo: string;

  public constructor(employee: EmployeeAuth) {
    this.nik = employee.nik;
    this.user_role = employee.position;
    this.profile_photo = getPhotoUrl(employee.profile_photo);
  }
}

export class LoginReqBody {
  @ApiProperty({ example: '123456789' })
  public readonly nik: string;

  @ApiProperty({ example: 'rahasia' })
  public readonly password: string;
}

export class LoginResBody extends ValidateTokenResBody {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkkujCJ9.eyJuaWsiOiIwMDEhugewNDU2MDA3MDEiLCJpYXQiOjE3MjcxMzczNjAsImV4cCI6MTcyNzc0MjE2MH0.uGwjj2AmJwJJ77QuZFf6nccBjkpbyW29Q2s0_69jjiE',
  })
  public readonly token: string;

  public constructor(employee: EmployeeAuth) {
    super(employee);
    this.token = sign({ nik: employee.nik }, SECRET_KEY, { expiresIn: '1w' });
  }
}
