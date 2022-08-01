import { teacherDto } from './dto/teacher.dto';
import {
  Injectable,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtPayload } from 'src/auth/types/jwtpayload.type';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TeacherService {
  constructor(private prisma: PrismaService) {}

  async teacherJoinClass(user: JwtPayload, dto: teacherDto) {
    try {
      const classMaker = await this.isClassMaker(user.sub, dto.classId);
      if (!classMaker) {
        return new ForbiddenException(`you'r not a class maker in this class`);
      }
      const data = await this.prisma.teacher.create({
        data: { teacherId: dto.userId, classId: dto.classId },
      });
      return {
        status: 'succes',
        message: 'succes add teacher',
        data: [
          { type: 'user', id: data.teacherId },
          { type: 'class', id: data.classId },
        ],
      };
    } catch (error) {
      return new ForbiddenException('user is already join class');
    }
  }

  async teacherLeaveClass(user: JwtPayload, dto: teacherDto) {
    try {
      const classMaker = await this.isClassMaker(user.sub, dto.classId);
      if (!classMaker) {
        return new ForbiddenException(
          `you'r not a class maker in this class or your class id is wrong`,
        );
      }
      const data = await this.prisma.teacher.delete({
        where: {
          teacherId_classId: { teacherId: dto.userId, classId: dto.classId },
        },
      });
      return {
        status: 'succes',
        message: 'succes remove teacher',
        data: [
          { type: 'user', id: data.teacherId },
          { type: 'class', id: data.classId },
        ],
      };
    } catch (error) {
      return new ForbiddenException('user is hasnt join yet');
    }
  }

  async isClassMaker(userId: string, classId: string) {
    try {
      const teacherData = await this.prisma.teacher.findUnique({
        where: { teacherId_classId: { teacherId: userId, classId } },
      });
      if (teacherData) {
        if (teacherData.classMaker) {
          return true;
        }
      }
      return false;
    } catch (error) {
      return new InternalServerErrorException(error.message);
    }
  }
}
