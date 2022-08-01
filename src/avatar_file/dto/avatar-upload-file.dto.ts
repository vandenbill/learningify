import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class avatarUploadFileDto {
  @ApiProperty({ type: 'Photo', format: 'jpg | jpeg | png' })
  @IsNotEmpty()
  file: any;
}
