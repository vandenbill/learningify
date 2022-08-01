import { JwtPayload } from './types/jwtpayload.type';
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { loginDto } from './dto/login.dto';
import { registerDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private JwtService: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: registerDto) {
    try {
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const data = await this.prisma.user.create({
        data: {
          updatedAt: this.getTimeStamp(),
          email: dto.email,
          name: dto.name,
          password: hashedPassword,
        },
      });
      return {
        status: 'succes',
        message: 'succes create new user',
        data: { type: 'user', id: data.id },
      };
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException('email already taken');
        }
      }
    }
  }

  async login(dto: loginDto) {
    let userData;
    let user;
    try {
      userData = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      user = await bcrypt.compare(dto.password, userData.password);
    } catch (error) {
      throw new ForbiddenException('email not registered');
    }
    if (!user) {
      throw new ForbiddenException('wrong password');
    }
    const acces_token = await this.generateAccesToken(
      userData.id,
      userData.email,
    );
    const refresh_token = await this.generateRefreshToken(
      userData.id,
      userData.email,
    );
    try {
      await this.prisma.user.update({
        where: { email: userData.email },
        data: { refresh_token: refresh_token },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
    return {
      status: 'succes',

      message: 'succes login',
      acces_token: acces_token,
      refresh_token: refresh_token,
    };
  }

  async logout(user: JwtPayload) {
    try {
      await this.prisma.user.update({
        where: { email: user.email },
        data: { refresh_token: null },
      });
      return {
        status: 'succes',
        message: 'succes logout',
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async refresh(user: { refreshToken: string; email: string; sub: string }) {
    let userData;
    try {
      userData = await this.prisma.user.findUnique({
        where: { email: user.email },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
    if (userData.refresh_token !== user.refreshToken) {
      return new ForbiddenException('Invalid Refresh Token');
    }
    return {
      status: 'succes',
      message: 'succes create new acces token',
      acces_token: await this.generateAccesToken(user.sub, user.email),
    };
  }

  async generateAccesToken(id: string, email: string) {
    const payload = { sub: id, email };
    const accesTokenSecret = this.config.get('ACCES_TOKEN_SECRET');
    const token = await this.JwtService.signAsync(payload, {
      expiresIn: '30m',
      secret: accesTokenSecret,
    });
    return token;
  }

  async generateRefreshToken(id: string, email: string) {
    const payload = { sub: id, email };
    const refreshTokenSecret = this.config.get('REFRESH_TOKEN_SECRET');
    const token = await this.JwtService.signAsync(payload, {
      expiresIn: '365d',
      secret: refreshTokenSecret,
    });
    return token;
  }

  getTimeStamp() {
    return new Date().toISOString();
  }
}
