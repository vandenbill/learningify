import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/auth/types/jwtpayload.type';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { join } from 'path';
import * as fs from 'fs';

@Injectable()
export class AvatarFileService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async addAvatar(user: JwtPayload, fileName: string) {
    try {
      await this.prisma.user.update({
        where: { id: user.sub },
        data: { avatar: fileName },
      });
      return {
        status: 'succes',
        message: 'succes add avatar',
        data: { type: 'avatar', fileName },
      };
    } catch (error) {
      return new InternalServerErrorException(error.message);
    }
  }

  async getAvatarByName(fileName: string, res) {
    try {
      res.sendFile(join(process.cwd(), 'public/avatar/' + fileName));
    } catch (error) {
      return new NotFoundException('file not found');
    }
  }

  async editAvatar(fileName: string, user: JwtPayload) {
    try {
      const userData = await this.prisma.user.findUnique({
        where: { id: user.sub },
      });
      fs.unlinkSync(join(process.cwd(), 'public/avatar/' + userData.avatar));
      await this.prisma.user.update({
        where: { id: user.sub },
        data: { avatar: fileName },
      });
      return {
        status: 'succes',
        message: 'succes update avatar',
        data: { type: 'avatar', fileName },
      };
    } catch (error) {
      return new NotFoundException('file not found');
    }
  }

  async deleteAvatar(user: JwtPayload) {
    try {
      const userData = await this.prisma.user.findUnique({
        where: { id: user.sub },
      });
      fs.unlinkSync(join(process.cwd(), 'public/avatar/' + userData.avatar));
      await this.prisma.user.update({
        where: { id: user.sub },
        data: { avatar: null },
      });
      return {
        status: 'succes',

        message: 'succes delete avatar',
      };
    } catch (error) {
      return new NotFoundException('file not found');
    }
  }
}
