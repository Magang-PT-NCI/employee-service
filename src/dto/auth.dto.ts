import { ApiProperty } from '@nestjs/swagger';
import { Position } from '../types/employee.types';

export class LoginReqBody {
  @ApiProperty({ example: '123456789' })
  nik: string;

  @ApiProperty({ example: 'rahasia' })
  password: string;
}

export class LoginResBody {
  @ApiProperty({ example: 'OnSite' })
  user_role: Position;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkkujCJ9.eyJuaWsiOiIwMDEhugewNDU2MDA3MDEiLCJpYXQiOjE3MjcxMzczNjAsImV4cCI6MTcyNzc0MjE2MH0.uGwjj2AmJwJJ77QuZFf6nccBjkpbyW29Q2s0_69jjiE',
  })
  token: string;
}

export class ValidateTokenReqBody {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkkujCJ9.eyJuaWsiOiIwMDEhugewNDU2MDA3MDEiLCJpYXQiOjE3MjcxMzczNjAsImV4cCI6MTcyNzc0MjE2MH0.uGwjj2AmJwJJ77QuZFf6nccBjkpbyW29Q2s0_69jjiE',
  })
  token: string;
}

export class ValidateTokenResBody {
  @ApiProperty({ example: '001230045600701' })
  nik: string;

  @ApiProperty({ example: 'OnSite' })
  user_role: Position;

  @ApiProperty({
    example:
      'https://lh3.googleusercontent.com/d/22ZximVkuhxCuS_j_Vve2CKTyHiju0aY=s220',
  })
  profile_photo: string;
}
