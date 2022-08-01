import { Module } from '@nestjs/common';
import { BannerFileController } from './banner_file.controller';
import { BannerFileService } from './banner_file.service';

@Module({
  controllers: [BannerFileController],
  providers: [BannerFileService],
})
export class BannerFileModule {}
