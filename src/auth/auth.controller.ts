import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { loginDto } from './dto/login.dto';
import { registerDto } from './dto/register.dto';
import { AtGuard } from './guard/at.guard';
import { RtGuard } from './guard/rt.guard';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(private AuthService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'register new user' })
  register(@Body() dto: registerDto) {
    return this.AuthService.register(dto);
  }

  @ApiOperation({ summary: 'login existing user' })
  @Post('login')
  @HttpCode(200)
  login(@Body() dto: loginDto) {
    return this.AuthService.login(dto);
  }

  @ApiOperation({ summary: 'logout user' })
  @UseGuards(AtGuard)
  @Get('logout')
  logout(@Req() req) {
    return this.AuthService.logout(req.user);
  }

  @UseGuards(RtGuard)
  @ApiOperation({ summary: 'get new acces token' })
  @ApiHeader({ name: 'Authorization', description: 'Bearer {Refresh Token}' })
  @Get('refresh')
  @HttpCode(200)
  refresh(@Req() req) {
    return this.AuthService.refresh(req.user);
  }
}
