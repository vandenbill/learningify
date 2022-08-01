import { AtGuard } from './../auth/guard/at.guard';
import { assignmentDto } from './dto/student_task.dto';
import { AssignmentService } from './assignment.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Assignment')
@UseGuards(AtGuard)
@Controller('api/assignment')
export class AssignmentController {
  constructor(private AssignmentService: AssignmentService) {}

  @Post()
  @ApiOperation({
    summary: "used to upload student's assignments",
  })
  addAssignment(@Req() req, @Body() dto: assignmentDto) {
    return this.AssignmentService.addAssignment(req.user, dto);
  }

  @Get('all/:taskId')
  @HttpCode(200)
  @ApiOperation({
    summary:
      'used to get all assignments in a task (only a teacher in that class can do this)',
  })
  getAllAssignment(@Req() req, @Param('taskId') taskId: string) {
    return this.AssignmentService.getAllAssignment(req.user, taskId);
  }

  @Patch()
  @ApiOperation({
    summary: "used to edit student' assignments",
  })
  editAssignment(@Req() req, @Body() dto: assignmentDto) {
    return this.AssignmentService.editAssignment(req.user, dto);
  }

  @ApiOperation({
    summary: "used to delete student' assignments",
  })
  @HttpCode(200)
  @Delete(':taskId')
  deleteAssignment(@Req() req, @Param('taskId') taskId: string) {
    return this.AssignmentService.deleteAssignment(req.user, taskId);
  }
}
