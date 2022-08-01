import { PrismaService } from 'src/prisma/prisma.service';
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtPayload } from 'src/auth/types/jwtpayload.type';
import { join } from 'path';
import * as fs from 'fs';

@Injectable()
export class ContentFileService {
  constructor(private prisma: PrismaService) {}

  async addContentFile(user: JwtPayload, fileName: string, contentId: string) {
    try {
      const content = await this.prisma.content.findUnique({
        where: { id: contentId },
      });
      if (!(await this.isTeacher(user.sub, content.classId))) {
        return new ForbiddenException(
          "you'r not a teacher in this class or your content id is wrong",
        );
      }
      await this.prisma.content.update({
        where: { id: contentId },
        data: { content: fileName },
      });
      return {
        status: 'succes',
        message: 'succes add content',
      };
    } catch (error) {
      return new NotFoundException(error.message);
    }
  }

  async getContentFileByName(fileName: string, res) {
    try {
      await this.prisma.content.findFirst({
        where: { content: fileName },
      });
      res.sendFile(join(process.cwd(), 'public/content/' + fileName));
    } catch (error) {
      return new NotFoundException('file name not found');
    }
  }

  async editContentFile(fileName: string, user: JwtPayload, contentId: string) {
    try {
      const content = await this.prisma.content.findUnique({
        where: { id: contentId },
      });
      if (!(await this.isTeacher(user.sub, content.classId))) {
        return new ForbiddenException(
          "you'r not a teacher in this class or your content id is wrong",
        );
      }
      fs.unlinkSync(join(process.cwd(), 'public/content/' + content.content));
      await this.prisma.content.update({
        where: { id: contentId },
        data: { content: fileName },
      });
      return {
        status: 'succes',
        message: 'succes update content',
      };
    } catch (error) {
      return new NotFoundException(error.message);
    }
  }

  async deleteContentFile(user: JwtPayload, contentId: string) {
    try {
      const content = await this.prisma.content.findUnique({
        where: { id: contentId },
      });
      if (!(await this.isTeacher(user.sub, content.classId))) {
        return new ForbiddenException(
          "you'r not a teacher in this class or your content id is wrong",
        );
      }
      fs.unlinkSync(join(process.cwd(), 'public/content/' + content.content));
      await this.prisma.content.update({
        where: { id: contentId },
        data: { content: null },
      });
      return {
        status: 'succes',

        message: 'succes delete content',
      };
    } catch (error) {
      return new NotFoundException(error.message);
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
