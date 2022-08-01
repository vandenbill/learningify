import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class taskUploadFileDto {
  @IsNotEmpty()
  @ApiProperty({
    type: 'Photo / Document',
    format: 'jpg | jpeg | png | pdf | txt | doc)',
  })
  file: Express.Multer.File;
}
