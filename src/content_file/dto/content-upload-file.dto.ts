import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class contentUploadFileDto {
  @ApiProperty({
    type: 'Photo / Document',
    format: 'jpg | jpeg | png | pdf | txt | doc)',
  })
  @IsNotEmpty()
  file: Express.Multer.File;
}
