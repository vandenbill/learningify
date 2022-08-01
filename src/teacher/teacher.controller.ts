import { teacherDto } from './dto/teacher.dto';
import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AtGuard } from 'src/auth/guard/at.guard';
import { TeacherService } from './teacher.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Teacher')
@UseGuards(AtGuard)
@Controller('api/teacher')
export class TeacherController {
  constructor(private TeacherService: TeacherService) {}

  @Post()
  @ApiOperation({
    summary:
      'used to add a user to become a teacher in a class (only class maker can do this)',
  })
  teacherJoinClass(@Req() req, @Body() dto: teacherDto) {
    return this.TeacherService.teacherJoinClass(req.user, dto);
  }

  @Delete()
  @HttpCode(200)
  @ApiOperation({
    summary:
      'used to delete a user that become a teacher in a class (only class maker can do this)',
  })
  studentLeaveClass(@Req() req, @Body() dto: teacherDto) {
    return this.TeacherService.teacherLeaveClass(req.user, dto);
  }
}
