import { ApiProperty } from '@nestjs/swagger';

export class ErrorResBody {
  @ApiProperty({ description: 'error message' })
  public readonly message: string;

  @ApiProperty({ description: 'error type' })
  public readonly error: string;

  @ApiProperty({ description: 'error status code' })
  public readonly statusCode: number;
}

export class ServerErrorResBody {
  @ApiProperty({
    description: 'error message',
    example: 'Internal Server Error',
  })
  message: string;

  @ApiProperty({ description: 'error status code', example: 500 })
  statusCode: number;
}
