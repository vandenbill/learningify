import { AtGuard } from 'src/auth/guard/at.guard';
import { AvatarFileService } from './avatar_file.service';
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
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { avatarUploadFileDto } from './dto/avatar-upload-file.dto';

@ApiTags('Avatar File')
@UseGuards(AtGuard)
@Controller('api/file/avatar')
export class AvatarFileController {
  constructor(private AvatarFileService: AvatarFileService) {}

  @Post()
  @ApiOperation({
    summary: 'used to upload avatar file',
  })
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './public/avatar',
        filename: (_, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          cb(null, filename);
        },
      }),
      fileFilter: (_, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(null, false);
        }
        return cb(null, true);
      },
    }),
  )
  @ApiBody({
    description: "avatar file, (form name is 'avatar')",
    type: avatarUploadFileDto,
  })
  @ApiConsumes('multipart/form-data')
  addAvatar(
    @Req() req,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 2_000_000 })
        .build(), // 2 mb
    )
    file: Express.Multer.File,
  ) {
    return this.AvatarFileService.addAvatar(req.user, file.filename);
  }

  @Get(':fileName')
  @HttpCode(200)
  @ApiOperation({
    summary: 'used to upload avatar file',
  })
  getAvatarByName(@Param('fileName') fileName: string, @Res() res) {
    return this.AvatarFileService.getAvatarByName(fileName, res);
  }

  @Patch()
  @ApiOperation({
    summary: 'used to edit avatar file',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: "avatar file, (form name is 'avatar')",
    type: avatarUploadFileDto,
  })
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './public/avatar',
        filename: (_, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          cb(null, filename);
        },
      }),
      fileFilter: (_, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(null, false);
        }
        return cb(null, true);
      },
    }),
  )
  editAvatar(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 2_000_000 })
        .build(), // 2 mb
    )
    file: Express.Multer.File,
    @Req() req,
  ) {
    return this.AvatarFileService.editAvatar(file.filename, req.user);
  }

  @Delete()
  @HttpCode(200)
  @ApiOperation({
    summary: 'used to delete avatar file',
  })
  deleteAvatar(@Req() req) {
    return this.AvatarFileService.deleteAvatar(req.user);
  }
}
