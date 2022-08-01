import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ClassModule } from './class/class.module';
import { TeacherModule } from './teacher/teacher.module';
import { StudentModule } from './student/student.module';
import { ContentModule } from './content/content.module';
import { TaskModule } from './task/task.module';
import { ScoreModule } from './score/score.module';
import { AvatarFileModule } from './avatar_file/avatar_file.module';
import { BannerFileModule } from './banner_file/banner_file.module';
import { TaskFileModule } from './task_file/task_file.module';
import { ContentFileModule } from './content_file/content_file.module';
import { UserModule } from './user/user.module';
import { AssignmentModule } from './assignment/assignment.module';
import { AssignmentFileModule } from './assignment_file/assignment_file.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    ClassModule,
    TeacherModule,
    StudentModule,
    ContentModule,
    TaskModule,
    ScoreModule,
    AvatarFileModule,
    BannerFileModule,
    TaskFileModule,
    ContentFileModule,
    UserModule,
    AssignmentModule,
    AssignmentFileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
