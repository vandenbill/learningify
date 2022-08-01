import { Module } from '@nestjs/common';
import { AvatarFileController } from './avatar_file.controller';
import { AvatarFileService } from './avatar_file.service';

@Module({
  controllers: [AvatarFileController],
  providers: [AvatarFileService],
})
export class AvatarFileModule {}
