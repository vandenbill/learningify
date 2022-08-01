import { ApiProperty } from '@nestjs/swagger';
import { isNotEmpty, IsNotEmpty, IsString } from 'class-validator';

export class deleteScoreDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  taskId: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  studentId: string;
}
