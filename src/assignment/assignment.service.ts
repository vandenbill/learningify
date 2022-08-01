import { assignmentDto } from './dto/student_task.dto';
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtPayload } from 'src/auth/types/jwtpayload.type';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AssignmentService {
  constructor(private prisma: PrismaService) {}

  async addAssignment(user: JwtPayload, dto: assignmentDto) {
    try {
      const studentClass = await this.isStudentClass(user.sub, dto.taskId);
      if (studentClass === false) {
        return new ForbiddenException(
          'your not student in this class or task id is wrong',
        );
      }
      await this.prisma.assignment.create({
        data: {
          studentId: user.sub,
          taskId: dto.taskId,
          description: dto.description,
        },
      });
      return {
        status: 'succes',

        message: 'succes create assignment',
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAllAssignment(user: JwtPayload, taskId: string) {
    try {
      const teacherClass = await this.isTeacherClass(user.sub, taskId);
      if (teacherClass === false) {
        return new ForbiddenException(
          'your not a teacher in this class or task id is wrong',
        );
      }
      const assignment = await this.prisma.assignment.findMany({
        where: { taskId },
      });
      return {
        status: 'succes',

        message: 'succes get all assignment',
        data: { type: 'assignments', assignment },
      };
    } catch (error) {
      return new InternalServerErrorException(error.message);
    }
  }

  async editAssignment(user: JwtPayload, dto: assignmentDto) {
    try {
      const studentClass = await this.isStudentClass(user.sub, dto.taskId);
      if (studentClass === false) {
        return new ForbiddenException(
          'your not student in this class or task id is wrong',
        );
      }
      await this.prisma.assignment.update({
        where: {
          taskId_studentId: { studentId: user.sub, taskId: dto.taskId },
        },
        data: { description: dto.description },
      });
      return {
        status: 'succes',

        message: 'succes edit assignment',
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteAssignment(user: JwtPayload, taskId: string) {
    try {
      const studentClass = await this.isStudentClass(user.sub, taskId);
      if (studentClass === false) {
        return new ForbiddenException(
          'your not student in this class or task id is wrong',
        );
      }
      await this.prisma.assignment.delete({
        where: { taskId_studentId: { studentId: user.sub, taskId } },
      });
      return {
        status: 'succes',

        message: 'succes delete assignment',
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async isStudentClass(userId: string, taskId: string) {
    try {
      const task = await this.prisma.task.findUnique({ where: { id: taskId } });
      const student = await this.prisma.student.findUnique({
        where: {
          studentId_classId: { studentId: userId, classId: task.classId },
        },
      });
      if (student) {
        return true;
      }
      return false;
    } catch (error) {
      throw new NotFoundException('taskId not found');
    }
  }

  async isTeacherClass(userId: string, taskId: string) {
    try {
      const task = await this.prisma.task.findUnique({ where: { id: taskId } });
      const teacher = await this.prisma.teacher.findUnique({
        where: {
          teacherId_classId: { teacherId: userId, classId: task.classId },
        },
      });
      if (teacher) {
        return true;
      }
      return false;
    } catch (error) {
      return new InternalServerErrorException(error.message);
    }
  }
}
