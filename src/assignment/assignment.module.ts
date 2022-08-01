import { Module } from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { AssignmentController } from './assignment.controller';

@Module({
  providers: [AssignmentService],
  controllers: [AssignmentController]
})
export class AssignmentModule {}
