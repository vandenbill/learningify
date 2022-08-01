import { Module } from '@nestjs/common';
import { AssignmentFileController } from './assignment_file.controller';
import { AssignmentFileService } from './assignment_file.service';

@Module({
  controllers: [AssignmentFileController],
  providers: [AssignmentFileService],
})
export class AssignmentFileModule {}
