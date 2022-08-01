import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtPayload } from 'src/auth/types/jwtpayload.type';
import { PrismaService } from 'src/prisma/prisma.service';
import { classDto } from './dto/class.dto';

@Injectable()
export class ClassService {
  constructor(private prisma: PrismaService) {}

  async addClass(user: JwtPayload, dto: classDto) {
    try {
      const classData = await this.prisma.class.create({
        data: { ...dto, updatedAt: this.getTimeStamp() },
      });
      const teacher = await this.prisma.teacher.create({
        data: { teacherId: user.sub, classId: classData.id, classMaker: true },
      });
      if (teacher) {
        return {
          status: 'succes',

          message: 'succes add class',
          data: { type: 'class', id: classData.id },
        };
      }
    } catch (error) {
      return new InternalServerErrorException(error.message);
    }
  }

  async getAllTeachClass(user: JwtPayload) {
    try {
      const classData = await this.prisma.class.findMany({
        where: {
          teachers: {
            some: {
              user: {
                id: user.sub,
              },
            },
          },
        },
        select: {
          id: true,
          name: true,
          description: true,
          banner: true,
          schedule: true,
        },
      });
      return {
        status: 'succes',

        message: 'succes get all teach class',
        data: { type: 'class', class: classData },
      };
    } catch (error) {
      return new NotFoundException(error.message);
    }
  }

  async getAllStudyClass(user: JwtPayload) {
    try {
      const classData = await this.prisma.class.findMany({
        where: {
          students: {
            some: {
              user: {
                id: user.sub,
              },
            },
          },
        },
        select: { id: true, name: true, description: true, banner: true },
      });
      return {
        status: 'succes',

        message: 'succes get all study class',
        data: { type: 'class', class: classData },
      };
    } catch (error) {
      return new NotFoundException(error.message);
    }
  }

  async getAllAboutClass(id: string) {
    try {
      const classData = await this.prisma.class.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          description: true,
          banner: true,
          schedule: true,
        },
      });
      const contentData = await this.prisma.content.findMany({
        where: { classId: id },
        select: { id: true, title: true, description: true, content: true },
      });
      const taskData = await this.prisma.task.findMany({
        where: { classId: id },
        select: { id: true, title: true, description: true, task: true },
      });
      const student = await this.prisma.user.findMany({
        where: {
          students: { some: { class: { id } } },
        },
        select: { id: true, name: true, email: true, avatar: true, bio: true },
      });
      const teacher = await this.prisma.user.findMany({
        where: {
          teachers: { some: { class: { id } } },
        },
        select: { id: true, name: true, email: true, avatar: true, bio: true },
      });
      if (!classData) {
        return new NotFoundException('classId not found');
      }
      return {
        status: 'succes',

        message: 'succes get all about class',
        data: [
          { type: 'class', class: classData },
          { type: 'content', content: contentData },
          { type: 'task', task: taskData },
          { type: 'teacher', teacher },
          { type: 'student', student },
        ],
      };
    } catch (error) {
      return new NotFoundException(error.message);
    }
  }

  async editClass(classId: string, dto: classDto, user: JwtPayload) {
    try {
      if (!(await this.isTeacher(user.sub, classId))) {
        return new ForbiddenException(
          "you'r not teacher in this class or your classId is wrong",
        );
      }
      const classData = await this.prisma.class.update({
        where: {
          id: classId,
        },
        data: { ...dto },
      });
      delete classData.createdAt;
      delete classData.updatedAt;
      return {
        status: 'succes',
        message: 'succes edit class',
        data: { type: 'class', class: classData },
      };
    } catch (error) {
      return new NotFoundException(error.message);
    }
  }

  async deleteClass(classId: string, user: JwtPayload) {
    try {
      if (!(await this.isTeacher(user.sub, classId))) {
        return new ForbiddenException(
          "you'r not teacher in this class or your classId is wrong",
        );
      }
      await this.prisma.class.delete({
        where: {
          id: classId,
        },
      });
      return {
        status: 'succes',

        message: 'succes delete class',
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

  getTimeStamp() {
    return new Date().toISOString();
  }
}
