import { AssignmentFileService } from './assignment_file.service';
import { assignmentFileDto } from './dto/student-task-file.dto';
import {
  Controller,
  Delete,
  Get,
  HttpCode,
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
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AtGuard } from 'src/auth/guard/at.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('api/file/assignment')
@ApiTags('Assignment File')
@UseGuards(AtGuard)
export class AssignmentFileController {
  constructor(private AssignmentFileService: AssignmentFileService) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: "assignment file (from name 'assignment')",
    type: assignmentFileDto,
  })
  @Post(':taskId')
  @ApiOperation({
    summary: "used for upload student's assignment file",
  })
  @UseInterceptors(
    FileInterceptor('assignment', {
      storage: diskStorage({
        destination: './public/assignment',
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
  addAssignmentFile(
    @Req() req,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 20_000_000 })
        .build(), // 20 mb
    )
    file: Express.Multer.File,
    @Param('taskId') taskId: string,
  ) {
    return this.AssignmentFileService.addAssignmentFile(
      req.user,
      file.filename,
      taskId,
    );
  }

  @Get(':fileName')
  @HttpCode(200)
  @ApiOperation({
    summary: "used to get student's assignmet file",
  })
  getAssignmentByName(@Param('fileName') fileName: string, @Res() res) {
    return this.AssignmentFileService.getAssignmentByName(fileName, res);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: "assignment file (from name 'assignment')",
    type: assignmentFileDto,
  })
  @Patch(':taskId')
  @ApiOperation({
    summary: "used to edit student's assignmet file",
  })
  @UseInterceptors(
    FileInterceptor('assignment', {
      storage: diskStorage({
        destination: './public/assignment',
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
  editAssignment(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 20_000_000 })
        .build(), // 20 mb
    )
    file: Express.Multer.File,
    @Req() req,
    @Param('taskId') taskId: string,
  ) {
    return this.AssignmentFileService.editAssignmentFile(
      file.filename,
      req.user,
      taskId,
    );
  }

  @Delete(':taskId')
  @HttpCode(200)
  @ApiOperation({
    summary: "used to delete student's assignmet file",
  })
  deleteAssignment(@Req() req, @Param('taskId') taskId: string) {
    return this.AssignmentFileService.deleteAssignmentFile(req.user, taskId);
  }
}
