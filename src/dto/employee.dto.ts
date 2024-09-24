import { ApiProperty } from '@nestjs/swagger';

export class EmployeeParams {
  @ApiProperty({ example: '123456789', description: 'nomor induk karyawan' })
  nik: string;
}

export class EmployeeResBody {
  @ApiProperty({ example: '123456789' })
  nik: string;

  @ApiProperty({ example: 'Ucup Surucup' })
  name: string;

  @ApiProperty({ example: 'Bandung' })
  area: string;

  @ApiProperty({ example: 'Programmer' })
  role: string;

  @ApiProperty({ example: 'OnSite' })
  position: string;
}
