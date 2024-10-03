import { ApiProperty } from '@nestjs/swagger';

export class EmployeeParams {
  @ApiProperty({ example: '123456789', description: 'nomor induk karyawan' })
  public readonly nik: string;
}

export class EmployeeResBody {
  @ApiProperty({ example: '123456789' })
  public readonly nik: string;

  @ApiProperty({ example: 'Ucup Surucup' })
  public readonly name: string;

  @ApiProperty({ example: 'Bandung' })
  public readonly area: string;

  @ApiProperty({ example: 'Programmer' })
  public readonly role: string;

  @ApiProperty({ example: 'OnSite' })
  public readonly position: string;
}
