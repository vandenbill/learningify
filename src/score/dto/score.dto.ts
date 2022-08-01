import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class scoreDto {
  @IsNotEmpty()
  @ApiProperty()
  taskId: string;

  @IsNotEmpty()
  @ApiProperty()
  studentId: string;

  @IsNotEmpty()
  @ApiProperty()
  score: number;
}
