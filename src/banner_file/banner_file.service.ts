import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { join } from 'path';
import { JwtPayload } from 'src/auth/types/jwtpayload.type';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs';

@Injectable()
export class BannerFileService {
  constructor(private prisma: PrismaService) {}

  async addBanner(user: JwtPayload, fileName: string, classId: string) {
    try {
      if (!(await this.isTeacher(user.sub, classId))) {
        return new ForbiddenException(
          "you'r not a teacher in this class or your class id is wrong",
        );
      }
      await this.prisma.class.update({
        where: { id: classId },
        data: { banner: fileName },
      });
      return {
        status: 'succes',

        message: 'succes add banner',
      };
    } catch (error) {
      return new NotFoundException('file not found');
    }
  }

  async getBannerByName(fileName: string, res) {
    try {
      res.sendFile(join(process.cwd(), 'public/banner/' + fileName));
    } catch (error) {
      return new NotFoundException('file not found');
    }
  }

  async editBanner(fileName: string, user: JwtPayload, classId: string) {
    try {
      if (!(await this.isTeacher(user.sub, classId))) {
        return new ForbiddenException(
          "you'r not a teacher in this class or your class id is wrong",
        );
      }
      const classData = await this.prisma.class.findUnique({
        where: { id: classId },
      });
      fs.unlinkSync(join(process.cwd(), 'public/banner/' + classData.banner));
      await this.prisma.class.update({
        where: { id: classId },
        data: { banner: fileName },
      });
      return {
        status: 'succes',

        message: 'succes update banner',
      };
    } catch (error) {
      return new NotFoundException('file not found');
    }
  }

  async deleteBanner(user: JwtPayload, classId: string) {
    try {
      if (!(await this.isTeacher(user.sub, classId))) {
        return new ForbiddenException(
          "you'r not a teacher in this class or your class id is wrong",
        );
      }
      const classData = await this.prisma.class.findUnique({
        where: { id: classId },
      });
      fs.unlinkSync(join(process.cwd(), 'public/banner/' + classData.banner));
      await this.prisma.class.update({
        where: { id: classId },
        data: { banner: null },
      });
      return {
        status: 'succes',

        message: 'succes delete banner',
      };
    } catch (error) {
      return new NotFoundException('file not found');
    }
  }

  async isTeacher(sub: string, classId: string) {
    try {
      const teacher = await this.prisma.teacher.findUnique({
        where: { teacherId_classId: { teacherId: sub, classId } },
      });
      if (teacher === null) {
        return false;
      }
      return true;
    } catch (error) {
      return new InternalServerErrorException(error.message);
    }
  }
}
