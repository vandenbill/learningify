import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtPayload } from 'src/auth/types/jwtpayload.type';
import { PrismaService } from 'src/prisma/prisma.service';
import { contentDto } from './dto/content.dto';

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}

  async addContent(dto: contentDto, user: JwtPayload, classId: string) {
    console.log(await this.isNotTeacher(user.sub, classId));
    if (await this.isNotTeacher(user.sub, classId)) {
      return new ForbiddenException(
        "you'r not a teacher in this class or your class id is wrong",
      );
    }
    try {
      await this.prisma.content.create({
        data: {
          ...dto,
          classId,
          updatedAt: this.getTimeStamp(),
        },
      });
      return {
        status: 'succes',
        message: 'succes add content',
      };
    } catch (error) {
      return new NotFoundException(error.message);
    }
  }

  async getContentByClassId(classId: string) {
    try {
      const content = await this.prisma.content.findMany({
        where: { classId },
      });
      if (!content) {
        return new NotFoundException('class id not found');
      }
      return {
        status: 'succes',

        message: 'succes get all content in a class',
        data: { type: 'content', content },
      };
    } catch (error) {
      return new NotFoundException(error.message);
    }
  }

  async getContentById(contentId: string) {
    try {
      const content = await this.prisma.content.findUnique({
        where: { id: contentId },
      });
      if (!content) {
        return new NotFoundException('content id not found');
      }
      return {
        status: 'succes',

        message: 'succes get content by id',
        data: { type: 'content', content },
      };
    } catch (error) {
      return new InternalServerErrorException(error.message);
    }
  }

  async editContent(dto: contentDto, user: JwtPayload, contentId: string) {
    try {
      const contentData = await this.prisma.content.findUnique({
        where: { id: contentId },
      });
      const classId = contentData.classId;
      if (await this.isNotTeacher(user.sub, classId)) {
        return new ForbiddenException(
          "you'r not a teacher in this class or your class id is wrong",
        );
      }
      await this.prisma.content.update({
        where: { id: contentId },
        data: {
          title: dto.title,
          description: dto.description,
          updatedAt: this.getTimeStamp(),
        },
      });
      return {
        status: 'succes',

        message: 'succes edit content',
      };
    } catch (error) {
      return new NotFoundException(error.message);
    }
  }

  async deleteContent(user: JwtPayload, contentId: string) {
    try {
      const contentData = await this.prisma.content.findUnique({
        where: { id: contentId },
      });
      const classId = contentData.classId;
      if (await this.isNotTeacher(user.sub, classId)) {
        return new ForbiddenException(
          "you'r not a teacher in this class or your class id is wrong",
        );
      }
      await this.prisma.content.delete({ where: { id: contentId } });
      return {
        status: 'succes',
        message: 'succes delete class',
      };
    } catch (error) {
      return new NotFoundException(error.message);
    }
  }

  async isNotTeacher(sub: string, classId: string) {
    try {
      const teacher = await this.prisma.teacher.findUnique({
        where: { teacherId_classId: { teacherId: sub, classId } },
      });
      if (teacher != null) {
        return false;
      }
      return true;
    } catch (error) {
      return new InternalServerErrorException(error.message);
    }
  }

  getTimeStamp() {
    return new Date().toISOString();
  }
}
