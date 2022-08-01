import { userDto } from './dto/edit.user.dto';
import { UserService } from './user.service';
import { AtGuard } from 'src/auth/guard/at.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@UseGuards(AtGuard)
@Controller('api/user')
export class UserController {
  constructor(private UserService: UserService) {}

  @Patch()
  @ApiOperation({
    summary: 'used to edit user profile / account',
  })
  editUser(@Req() req, @Body() dto: userDto) {
    return this.UserService.editUser(req.user, dto);
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({
    summary: 'used to get user profile / account',
  })
  getUser(@Req() req) {
    return this.UserService.getUser(req.user);
  }

  @Delete()
  @HttpCode(200)
  @ApiOperation({
    summary: 'used to delete user profile / account',
  })
  deleteUser(@Req() req) {
    return this.UserService.deleteUser(req.user);
  }
}
