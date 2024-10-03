import { ApiProperty } from '@nestjs/swagger';

export class ErrorResBody {
  @ApiProperty({ description: 'error message' })
  public readonly message: string;

  @ApiProperty({ description: 'error type' })
  public readonly error: string;

  @ApiProperty({ description: 'error status code' })
  public readonly statusCode: number;
}
