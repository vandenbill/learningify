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
export class TaskFileService {
  constructor(private prisma: PrismaService) {}

  async addTaskFile(user: JwtPayload, fileName: string, taskId: string) {
    try {
      const task = await this.prisma.task.findUnique({
        where: { id: taskId },
      });
      if (!(await this.isNotTeacher(user.sub, task.classId))) {
        return new ForbiddenException(
          "you'r not teacher in this class or your task id is wrong",
        );
      }
      await this.prisma.task.update({
        where: { id: taskId },
        data: { task: fileName },
      });
      return {
        status: 'succes',
        message: 'succes add task file',
        data: { type: 'task', fileName },
      };
    } catch (error) {
      return new InternalServerErrorException(error.message);
    }
  }

  async getTaskFileByName(fileName: string, res) {
    try {
      await this.prisma.task.findFirst({
        where: { task: fileName },
      });

      res.sendFile(join(process.cwd(), 'public/task/' + fileName));
    } catch (error) {
      return new NotFoundException('file not found');
    }
  }

  async editTaskFile(fileName: string, user: JwtPayload, taskId: string) {
    try {
      const task = await this.prisma.task.findUnique({
        where: { id: taskId },
      });
      if (!(await this.isNotTeacher(user.sub, task.classId))) {
        return new ForbiddenException(
          "you'r not teacher in this class or your task id is wrong",
        );
      }
      const data = await this.prisma.task.update({
        where: { id: taskId },
        data: { task: fileName },
      });
      fs.unlinkSync(join(process.cwd(), 'public/task/' + task.task));
      return { status: 'succes', message: 'succes update task' };
    } catch (error) {
      throw new NotFoundException('something wrong with your input');
    }
  }

  async deleteTaskFile(user: JwtPayload, taskId: string) {
    try {
      const task = await this.prisma.task.findUnique({
        where: { id: taskId },
      });
      if (!(await this.isNotTeacher(user.sub, task.classId))) {
        return new ForbiddenException(
          "you'r not teacher in this class or your task id is wrong",
        );
      }
      fs.unlinkSync(join(process.cwd(), 'public/task/' + task.task));
      await this.prisma.task.update({
        where: { id: taskId },
        data: { task: null },
      });
      return { status: 'succes', message: 'succes delete task' };
    } catch (error) {
      return new InternalServerErrorException(error.message);
    }
  }

  async isNotTeacher(sub: string, classId: string) {
    try {
      const teacher = await this.prisma.teacher.findUnique({
        where: { teacherId_classId: { teacherId: sub, classId } },
      });
      if (teacher != null) {
        return true;
      }
      return false;
    } catch (error) {
      return new InternalServerErrorException(error.message);
    }
  }
}
