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
export class AssignmentFileService {
  constructor(private prisma: PrismaService) {}

  async addAssignmentFile(user: JwtPayload, fileName: string, taskId: string) {
    if (!(await this.isStudentClass(user.sub, taskId))) {
      return new ForbiddenException('youre not a student in this class');
    }
    console.log(!(await this.isStudentClass(user.sub, taskId)));
    try {
      await this.prisma.assignment.update({
        where: { taskId_studentId: { taskId, studentId: user.sub } },
        data: { assignment: fileName },
      });
      return {
        status: 'succes',
        message: 'succes create assignment file',
        data: { type: 'assignment', fileName },
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAssignmentByName(fileName: string, res) {
    try {
      await this.prisma.task.findFirst({
        where: { task: fileName },
      });
      res.sendFile(join(process.cwd(), 'public/assignment/' + fileName));
    } catch (error) {
      throw new NotFoundException('file not found');
    }
  }

  async editAssignmentFile(fileName: string, user: JwtPayload, taskId: string) {
    try {
      if (!(await this.isStudentClass(user.sub, taskId))) {
        return new ForbiddenException('youre not a student in this class');
      }
      const taskData = await this.prisma.assignment.findUnique({
        where: { taskId_studentId: { taskId, studentId: user.sub } },
      });
      fs.unlinkSync(
        join(process.cwd(), 'public/assignment/' + taskData.assignment),
      );
      await this.prisma.assignment.update({
        where: { taskId_studentId: { taskId, studentId: user.sub } },
        data: { assignment: fileName },
      });
      return {
        status: 'succes',
        message: 'succes edit assignment file',
        data: { type: 'assignment', fileName },
      };
    } catch (error) {
      throw new NotFoundException('file not found');
    }
  }

  async deleteAssignmentFile(user: JwtPayload, taskId: string) {
    try {
      if (!(await this.isStudentClass(user.sub, taskId))) {
        return new ForbiddenException('youre not a student in this class');
      }
      const taskData = await this.prisma.assignment.findUnique({
        where: { taskId_studentId: { taskId, studentId: user.sub } },
      });
      fs.unlinkSync(
        join(process.cwd(), 'public/assignment/' + taskData.assignment),
      );
      await this.prisma.task.delete({
        where: { id: taskId },
      });
      return {
        status: 'succes',
        message: 'succes delete assignment file',
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
}
