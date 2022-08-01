import { AtGuard } from './../auth/guard/at.guard';
import { TaskFileService } from './task_file.service';
import {
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { taskUploadFileDto } from './dto/task-upload-file.dto';

@ApiTags('Task File')
@UseGuards(AtGuard)
@Controller('api/file/task')
export class TaskFileController {
  constructor(private TaskFileService: TaskFileService) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: "Task File, Form Name is 'task'",
    type: taskUploadFileDto,
  })
  @Post(':taskId')
  @ApiOperation({
    summary: 'endpoint for upload task file, only teacher class can do this',
  })
  @UseInterceptors(
    FileInterceptor('task', {
      storage: diskStorage({
        destination: './public/task',
        filename: (_, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          cb(null, filename);
        },
      }),
      fileFilter: (_, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|pdf|txt|doc)$/)) {
          return cb(null, false);
        }
        return cb(null, true);
      },
    }),
  )
  addTask(
    @Req() req,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 20_000_000 })
        .build(), // 20 mb
    )
    file: Express.Multer.File,
    @Param('taskId') taskId: string,
  ) {
    return this.TaskFileService.addTaskFile(req.user, file.filename, taskId);
  }

  @Get(':fileName')
  @ApiOperation({
    summary: 'endpoint for get task file',
  })
  getTaskByName(@Param('fileName') fileName: string, @Res() res) {
    return this.TaskFileService.getTaskFileByName(fileName, res);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: "Task File, Form Name is 'task'",
    type: taskUploadFileDto,
  })
  @Patch(':taskId')
  @UseInterceptors(
    FileInterceptor('task', {
      storage: diskStorage({
        destination: './public/task',
        filename: (_, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          cb(null, filename);
        },
      }),
      fileFilter: (_, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|pdf|txt|doc)$/)) {
          return cb(null, false);
        }
        return cb(null, true);
      },
    }),
  )
  @ApiOperation({
    summary: 'endpoint for edit task file, only teacher class can do this',
  })
  editTask(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 20_000_000 })
        .build(), // 20 mb
    )
    file: Express.Multer.File,

    @Req() req,
    @Param('taskId') taskId: string,
  ) {
    return this.TaskFileService.editTaskFile(file.filename, req.user, taskId);
  }

  @Delete(':taskId')
  @ApiOperation({
    summary: 'endpoint for delete task file, only teacher class can do this',
  })
  deleteTask(@Req() req, @Param('taskId') taskId: string) {
    return this.TaskFileService.deleteTaskFile(req.user, taskId);
  }
}
