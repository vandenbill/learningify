import { Injectable, ForbiddenException } from '@nestjs/common';
import { JwtPayload } from 'src/auth/types/jwtpayload.type';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  async studentJoinClass(user: JwtPayload, classId: string) {
    try {
      const teacher = await this.prisma.teacher.findFirst({
        where: { teacherId: user.sub },
      });
      if (teacher) {
        return new ForbiddenException(
          "you'r a teacher in this class, or class id is wrong",
        );
      }
      const data = await this.prisma.student.create({
        data: { studentId: user.sub, classId },
      });
      return {
        status: 'succes',
        message: 'succes join as student class',
        data: [
          { type: 'user', id: data.studentId },
          { type: 'class', id: data.classId },
        ],
      };
    } catch (error) {
      return new ForbiddenException(
        'user already join class, or class id wrong',
      );
    }
  }

  async studentLeaveClass(user: JwtPayload, classId: string) {
    try {
      const data = await this.prisma.student.delete({
        where: {
          studentId_classId: { studentId: user.sub, classId: classId },
        },
      });
      return {
        status: 'succes',
        message: 'succes leave class',
        data: [
          { type: 'user', id: data.studentId },
          { type: 'class', id: data.classId },
        ],
      };
    } catch (error) {
      return new ForbiddenException("user hasn't join class yet");
    }
  }
}
