import { ContentFileService } from './content_file.service';
import { ContentFileController } from './content_file.controller';
import { Module } from '@nestjs/common';

@Module({
  controllers: [ContentFileController],
  providers: [ContentFileService],
})
export class ContentFileModule {}
