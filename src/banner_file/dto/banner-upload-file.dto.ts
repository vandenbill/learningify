import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class bannerUploadFileDto {
  @ApiProperty({ type: 'Photo', format: 'jpg | jpeg | png' })
  @IsNotEmpty()
  file: Express.Multer.File;
}
