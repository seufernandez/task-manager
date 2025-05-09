import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';
import { Task } from './task.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]), 
    AuthModule
  ],
  controllers: [TasksController],
  providers: [
    TasksService, 
    TasksRepository,
    JwtAuthGuard
  ],
})
export class TasksModule {}
