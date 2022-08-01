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
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AtGuard } from 'src/auth/guard/at.guard';
import { ClassService } from './class.service';
import { classDto } from './dto/class.dto';

@ApiTags('Class')
@UseGuards(AtGuard)
@Controller('/api/class')
export class ClassController {
  constructor(private ClassService: ClassService) {}

  @Post()
  @ApiOperation({ summary: 'used to create new class' })
  addClass(@Req() req, @Body() dto: classDto) {
    return this.ClassService.addClass(req.user, dto);
  }

  @Get('teach')
  @HttpCode(200)
  @ApiOperation({ summary: 'used to get all class that user teach' })
  async getAllTeachClass(@Req() req) {
    return this.ClassService.getAllTeachClass(req.user);
  }

  @Get('study')
  @HttpCode(200)
  @ApiOperation({ summary: 'used to get all class that user became a student' })
  async getAllStudyClass(@Req() req) {
    return this.ClassService.getAllStudyClass(req.user);
  }

  @Get(':classId')
  @HttpCode(200)
  @ApiOperation({ summary: 'used to get all about class' })
  getAllAboutClass(@Param('classId') classId: string) {
    return this.ClassService.getAllAboutClass(classId);
  }

  @Patch(':classId')
  @ApiOperation({ summary: 'used to edit class that user teach' })
  editClass(
    @Param('classId') classId: string,
    @Body() dto: classDto,
    @Req() req,
  ) {
    return this.ClassService.editClass(classId, dto, req.user);
  }

  @Delete(':classId')
  @HttpCode(200)
  @ApiOperation({ summary: 'used delete class that user teach' })
  deleteClass(@Param('classId') classId: string, @Req() req) {
    return this.ClassService.deleteClass(classId, req.user);
  }
}
