import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class userDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  bio?: string;

  @IsOptional()
  @ApiProperty()
  @IsString()
  password?: string;
}
