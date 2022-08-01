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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AtGuard } from 'src/auth/guard/at.guard';
import { ContentService } from './content.service';
import { contentDto } from './dto/content.dto';

@UseGuards(AtGuard)
@ApiTags('Content')
@Controller('api/content')
export class ContentController {
  constructor(private ContentService: ContentService) {}

  @Post(':classId')
  @ApiOperation({
    summary: 'used to create content (only teacher can do this)',
  })
  addContent(
    @Body() dto: contentDto,
    @Req() req,
    @Param('classId') classId: string,
  ) {
    return this.ContentService.addContent(dto, req.user, classId);
  }

  @Get('class/:classId')
  @HttpCode(200)
  @ApiOperation({
    summary: 'used to get all content in a class',
  })
  getContentByClassId(@Param('classId') classId: string) {
    return this.ContentService.getContentByClassId(classId);
  }

  @HttpCode(200)
  @Get(':contentId')
  @ApiOperation({
    summary: 'used to get spesific content',
  })
  getContentById(@Param('contentId') contentId: string) {
    return this.ContentService.getContentById(contentId);
  }

  @Patch(':contentId')
  @ApiOperation({
    summary: 'used to edit spesific content (only teacher can do this)',
  })
  editContent(
    @Body() dto: contentDto,
    @Req() req,
    @Param('contentId') contentId: string,
  ) {
    return this.ContentService.editContent(dto, req.user, contentId);
  }

  @HttpCode(200)
  @Delete(':contentId')
  @ApiOperation({
    summary: 'delete spesific content (only teacher can do this)',
  })
  deleteContent(@Req() req, @Param('contentId') contentId: string) {
    return this.ContentService.deleteContent(req.user, contentId);
  }
}
