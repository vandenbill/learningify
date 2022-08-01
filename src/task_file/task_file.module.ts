import { Module } from '@nestjs/common';
import { TaskFileService } from './task_file.service';
import { TaskFileController } from './task_file.controller';

@Module({
  providers: [TaskFileService],
  controllers: [TaskFileController],
})
export class TaskFileModule {}
