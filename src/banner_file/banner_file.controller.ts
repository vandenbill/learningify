import { AtGuard } from 'src/auth/guard/at.guard';
import { BannerFileService } from './banner_file.service';
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
import { bannerUploadFileDto } from './dto/banner-upload-file.dto';

@ApiTags('Banner File')
@UseGuards(AtGuard)
@Controller('api/file/banner')
export class BannerFileController {
  constructor(private BannerFileService: BannerFileService) {}

  @Post(':classId')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: "banner file, (form name is 'banner')",
    type: bannerUploadFileDto,
  })
  @ApiOperation({
    summary: 'used to upload banner file, only teacher can do this',
  })
  @UseInterceptors(
    FileInterceptor('banner', {
      storage: diskStorage({
        destination: './public/banner',
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
  addBanner(
    @Req() req,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 2_000_000 })
        .build(), // 2 mb
    )
    file: Express.Multer.File,

    @Param('classId') classId: string,
  ) {
    return this.BannerFileService.addBanner(req.user, file.filename, classId);
  }

  @Get(':fileName')
  @HttpCode(200)
  @ApiOperation({
    summary: 'used to get banner file',
  })
  getBannerByName(@Param('fileName') fileName: string, @Res() res) {
    return this.BannerFileService.getBannerByName(fileName, res);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: "banner file, (form name is 'banner')",
    type: bannerUploadFileDto,
  })
  @ApiOperation({
    summary:
      'endpoint for edit banner file, from name is banner, only teacher can do this',
  })
  @Patch(':classId')
  @UseInterceptors(
    FileInterceptor('banner', {
      storage: diskStorage({
        destination: './public/Banner',
        filename: (_, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(null, false);
        }
        return cb(null, true);
      },
    }),
  )
  editBanner(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 2_000_000 })
        .build(), // 2 mb
    )
    file: Express.Multer.File,

    @Req() req,
    @Param('classId') classId: string,
  ) {
    return this.BannerFileService.editBanner(file.filename, req.user, classId);
  }

  @Delete(':classId')
  @HttpCode(200)
  @ApiOperation({
    summary: 'endpoint for delete banner file, only teacher can do this',
  })
  deleteBanner(@Req() req, @Param('classId') classId: string) {
    return this.BannerFileService.deleteBanner(req.user, classId);
  }
}
