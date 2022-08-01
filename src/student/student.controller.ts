import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AtGuard } from 'src/auth/guard/at.guard';
import { StudentService } from './student.service';

@UseGuards(AtGuard)
@ApiTags('Student')
@Controller('api/student')
export class StudentController {
  constructor(private StudentService: StudentService) {}

  @Get(':classId')
  @HttpCode(200)
  @ApiOperation({
    summary:
      'api for join a class (everyone can join a class except the teacher in that class)',
  })
  studentJoinClass(@Req() req, @Param('classId') classId: string) {
    return this.StudentService.studentJoinClass(req.user, classId);
  }

  @Delete(':classId')
  @HttpCode(200)
  @ApiOperation({
    summary: 'api for leave a class (everyone can leave a class)',
  })
  studentLeaveClass(@Req() req, @Param('classId') classId: string) {
    return this.StudentService.studentLeaveClass(req.user, classId);
  }
}
