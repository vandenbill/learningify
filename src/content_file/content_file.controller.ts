import { AtGuard } from './../auth/guard/at.guard';
import { ContentFileService } from './content_file.service';
import { FileInterceptor } from '@nestjs/platform-express';
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
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { contentUploadFileDto } from './dto/content-upload-file.dto';

@UseGuards(AtGuard)
@Controller('api/file/content')
@ApiTags('Content File')
export class ContentFileController {
  constructor(private ContentFileService: ContentFileService) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: "content file (form name is 'content')",
    type: contentUploadFileDto,
  })
  @Post(':contentId')
  @ApiOperation({
    summary: 'used to upload content file, only teacher can do this',
  })
  @UseInterceptors(
    FileInterceptor('content', {
      storage: diskStorage({
        destination: './public/content',
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
  addContentFile(
    @Req() req,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 20_000_000 })
        .build(), // 20 mb
    )
    file: Express.Multer.File,

    @Param('contentId') contentId: string,
  ) {
    return this.ContentFileService.addContentFile(
      req.user,
      file.filename,
      contentId,
    );
  }

  @Get(':fileName')
  @HttpCode(200)
  @ApiOperation({
    summary: 'used to get content file',
  })
  getContentFileByName(@Param('fileName') fileName: string, @Res() res) {
    return this.ContentFileService.getContentFileByName(fileName, res);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: "content file (form name is 'content')",
    type: contentUploadFileDto,
  })
  @ApiOperation({
    summary: 'used to edit content file, only teacher can do this',
  })
  @Patch(':contentId')
  @UseInterceptors(
    FileInterceptor('content', {
      storage: diskStorage({
        destination: './public/content',
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
  editContentFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 20_000_000 })
        .build(), // 20 mb
    )
    file: Express.Multer.File,
    @Req() req,
    @Param('contentId') contentId: string,
  ) {
    return this.ContentFileService.editContentFile(
      file.filename,
      req.user,
      contentId,
    );
  }

  @Delete(':contentId')
  @HttpCode(200)
  @ApiOperation({
    summary: 'used to delete content file, only teacher can do this',
  })
  deleteContentFile(@Req() req, @Param('contentId') contentId: string) {
    return this.ContentFileService.deleteContentFile(req.user, contentId);
  }
}
