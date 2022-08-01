import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtPayload } from 'src/auth/types/jwtpayload.type';
import { PrismaService } from 'src/prisma/prisma.service';
import { userDto } from './dto/edit.user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editUser(user: JwtPayload, dto: userDto) {
    try {
      await this.prisma.user.update({
        where: { id: user.sub },
        data: { ...dto },
      });
      return {
        status: 'succes',

        message: 'succes update user data',
      };
    } catch (error) {
      return new InternalServerErrorException(error.message);
    }
  }

  async getUser(user: JwtPayload) {
    try {
      const userData = await this.prisma.user.findUnique({
        where: { id: user.sub },
        select: { id: true, name: true, avatar: true, bio: true },
      });
      return {
        status: 'succes',
        message: 'succes get user data',
        data: { type: 'user', user: userData },
      };
    } catch (error) {
      return new InternalServerErrorException(error.message);
    }
  }

  async deleteUser(user: JwtPayload) {
    try {
      await this.prisma.user.delete({ where: { id: user.sub } });
      return {
        status: 'succes',

        message: 'succes delete user',
      };
    } catch (error) {
      return new InternalServerErrorException(error.message);
    }
  }
}
