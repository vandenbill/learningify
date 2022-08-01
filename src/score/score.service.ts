import {
  Injectable,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtPayload } from 'src/auth/types/jwtpayload.type';
import { PrismaService } from 'src/prisma/prisma.service';
import { deleteScoreDto } from './dto/delete-score.dto';
import { scoreDto } from './dto/score.dto';

@Injectable()
export class ScoreService {
  constructor(private prisma: PrismaService) {}

  async addScore(dto: scoreDto, user: JwtPayload) {
    try {
      const taskData = await this.prisma.task.findUnique({
        where: { id: dto.taskId },
      });

      if (!(await this.isTeacher(user.sub, taskData.classId))) {
        return new ForbiddenException(
          'your not a teacher in this class or task id is wrong',
        );
      }
      const score = await this.prisma.score.create({
        data: {
          studentId: dto.studentId,
          taskId: dto.taskId,
          score: +dto.score,
        },
      });
      return {
        status: 'succes',

        message: 'succes add score',

        data: { type: 'score', score },
      };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async getAllScoreInTask(taskId: string) {
    try {
      const score = await this.prisma.score.findMany({
        where: { taskId: taskId },
      });
      if (!score) {
        return new NotFoundException('task id is wrong');
      }
      return {
        status: 'succes',
        message: 'succes get all score in a task',
        data: { type: 'score', score },
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async editScore(dto: scoreDto, user: JwtPayload) {
    try {
      const taskData = await this.prisma.task.findUnique({
        where: { id: dto.taskId },
      });
      if (!(await this.isTeacher(user.sub, taskData.classId))) {
        return new ForbiddenException(
          'your not a teacher in this class or task id is wrong',
        );
      }
      await this.prisma.score.update({
        where: {
          taskId_studentId: { taskId: dto.taskId, studentId: dto.studentId },
        },
        data: { score: +dto.score },
      });
      return {
        status: 'succes',
        message: 'succes update score',
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteScore(dto: deleteScoreDto, user: JwtPayload) {
    try {
      const taskData = await this.prisma.task.findUnique({
        where: { id: dto.taskId },
      });
      if (!(await this.isTeacher(user.sub, taskData.classId))) {
        return new ForbiddenException(
          'your not a teacher in this class or task id is wrong',
        );
      }
      await this.prisma.score.delete({
        where: {
          taskId_studentId: { taskId: dto.taskId, studentId: dto.studentId },
        },
      });
      return {
        status: 'succes',

        message: 'succes delete score',
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
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
      throw new InternalServerErrorException(error.message);
    }
  }
}
