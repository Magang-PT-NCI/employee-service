import { ApiProperty } from '@nestjs/swagger';
import { Position } from '../types/employee.types';

export class LoginReqBody {
  @ApiProperty({ example: '123456789' })
  public readonly nik: string;

  @ApiProperty({ example: 'rahasia' })
  public readonly password: string;
}

export class LoginResBody {
  @ApiProperty({ example: '001230045600701' })
  public readonly nik: string;

  @ApiProperty({ example: 'OnSite' })
  public readonly user_role: Position;

  @ApiProperty({
    example:
      'https://lh3.googleusercontent.com/d/22ZximVkuhxCuS_j_Vve2CKTyHiju0aY=s220',
  })
  public readonly profile_photo: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkkujCJ9.eyJuaWsiOiIwMDEhugewNDU2MDA3MDEiLCJpYXQiOjE3MjcxMzczNjAsImV4cCI6MTcyNzc0MjE2MH0.uGwjj2AmJwJJ77QuZFf6nccBjkpbyW29Q2s0_69jjiE',
  })
  public readonly token: string;
}

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
  public readonly user_role: Position;

  @ApiProperty({
    example:
      'https://lh3.googleusercontent.com/d/22ZximVkuhxCuS_j_Vve2CKTyHiju0aY=s220',
  })
  public readonly profile_photo: string;
}
