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
import { deleteScoreDto } from './dto/delete-score.dto';
import { scoreDto } from './dto/score.dto';
import { ScoreService } from './score.service';

@ApiTags('Score')
@UseGuards(AtGuard)
@Controller('api/score')
export class ScoreController {
  constructor(private ScoreService: ScoreService) {}

  @Post()
  @ApiOperation({
    summary: 'used to give a score to student (only teacher can do this)',
  })
  addScore(@Body() dto: scoreDto, @Req() req) {
    return this.ScoreService.addScore(dto, req.user);
  }

  @Get(':taskId')
  @HttpCode(200)
  @ApiOperation({
    summary: 'used to get all scores in a task',
  })
  getAllScoreInTask(@Param('taskId') taskId: string) {
    return this.ScoreService.getAllScoreInTask(taskId);
  }

  @Patch()
  @ApiOperation({
    summary: 'used to edit a score for student (only teacher can do this)',
  })
  editScore(@Body() dto: scoreDto, @Req() req) {
    return this.ScoreService.editScore(dto, req.user);
  }

  @Delete()
  @HttpCode(200)
  @ApiOperation({
    summary: 'used to delete a score (only teacher can do this)',
  })
  deleteScore(@Body() dto: deleteScoreDto, @Req() req) {
    return this.ScoreService.deleteScore(dto, req.user);
  }
}
