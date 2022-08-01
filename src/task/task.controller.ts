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
import { taskDto } from './dto/task.dto';
import { TaskService } from './task.service';
import { AtGuard } from 'src/auth/guard/at.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Task')
@UseGuards(AtGuard)
@Controller('api/task')
export class TaskController {
  constructor(private TaskService: TaskService) {}

  @Post(':classId')
  @ApiOperation({
    summary: 'teacher upload task in a class',
  })
  addContent(
    @Body() dto: taskDto,
    @Req() req,
    @Param('classId') classId: string,
  ) {
    return this.TaskService.addTask(dto, req.user, classId);
  }

  @ApiOperation({
    summary: 'teacher get all task in a class',
  })
  @HttpCode(200)
  @Get('class/:classId')
  getContentByClassId(@Param('classId') classId: string) {
    return this.TaskService.getTaskByClassId(classId);
  }

  @Get(':taskId')
  @HttpCode(200)
  @ApiOperation({
    summary: 'everyone can look a specific task',
  })
  getContentById(@Param('taskId') taskId: string) {
    return this.TaskService.getTaskById(taskId);
  }

  @Patch(':taskId')
  @ApiOperation({
    summary: 'teacher edit task',
  })
  editContent(
    @Body() dto: taskDto,
    @Req() req,
    @Param('taskId') contentId: string,
  ) {
    return this.TaskService.editTask(dto, req.user, contentId);
  }

  @Delete(':taskId')
  @HttpCode(200)
  @ApiOperation({
    summary: 'teacher delete task',
  })
  deleteContent(@Req() req, @Param('taskId') taskId: string) {
    return this.TaskService.deleteTask(req.user, taskId);
  }
}
