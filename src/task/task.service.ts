import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtPayload } from 'src/auth/types/jwtpayload.type';
import { PrismaService } from 'src/prisma/prisma.service';
import { taskDto } from './dto/task.dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async addTask(dto: taskDto, user: JwtPayload, classId: string) {
    if (await this.isNotTeacher(user.sub, classId)) {
      return new ForbiddenException(
        "you'r not a teacher in this class or class id is wrong",
      );
    }
    try {
      const task = await this.prisma.task.create({
        data: {
          ...dto,
          classId,
          updatedAt: this.getTimeStamp(),
        },
      });
      return {
        status: 'succes',
        message: 'succes add task',
        data: { type: 'task', id: task.id },
      };
    } catch (error) {
      return new InternalServerErrorException(error.message);
    }
  }

  async getTaskByClassId(classId: string) {
    try {
      const task = await this.prisma.task.findMany({
        where: { classId },
        select: { id: true, title: true, description: true, task: true },
      });
      if (!task) {
        return new NotFoundException('task id not found');
      }
      return {
        status: 'succes',
        message: 'succes get all task in a class',
        data: { type: 'task', task },
      };
    } catch (error) {
      return new InternalServerErrorException(error.message);
    }
  }

  async getTaskById(taskId: string) {
    try {
      const task = await this.prisma.task.findUnique({
        where: { id: taskId },
      });
      if (!task) {
        return new NotFoundException('task id not found');
      }
      return {
        status: 'succes',
        message: 'succes get task by id',
        data: { type: 'task', task },
      };
    } catch (error) {
      return new InternalServerErrorException(error.message);
    }
  }

  async editTask(dto: taskDto, user: JwtPayload, taskId: string) {
    try {
      const taskData = await this.prisma.task.findUnique({
        where: { id: taskId },
      });
      const classId = taskData.classId;
      if (await this.isNotTeacher(user.sub, classId)) {
        return new ForbiddenException(
          "you'r not teacher in this class or your taskId is wrong",
        );
      }
      const task = await this.prisma.task.update({
        where: { id: taskId },
        data: {
          title: dto.title,
          description: dto.description,
          updatedAt: this.getTimeStamp(),
        },
      });

      return {
        status: 'succes',

        message: 'succes edit task',
      };
    } catch (error) {
      return new InternalServerErrorException(error.message);
    }
  }

  async deleteTask(user: JwtPayload, taskId: string) {
    try {
      const taskData = await this.prisma.task.findUnique({
        where: { id: taskId },
      });
      const classId = taskData.classId;
      if (await this.isNotTeacher(user.sub, classId)) {
        return new ForbiddenException(
          "you'r not teacher in this class or your taskId is wrong",
        );
      }
      await this.prisma.task.delete({ where: { id: taskId } });
      return {
        status: 'succes',
        message: 'succes delete class',
      };
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
