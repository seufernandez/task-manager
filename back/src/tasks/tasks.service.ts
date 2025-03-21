import { Injectable } from '@nestjs/common';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async findAll(userId: number): Promise<Task[]> {
    return this.tasksRepository.findAll(userId);
  }

  async findOne(id: number, userId: number): Promise<Task> {
    return this.tasksRepository.findOne(id, userId);
  }

  async create(createTaskDto: CreateTaskDto, userId: number): Promise<Task> {
    return this.tasksRepository.create(createTaskDto, userId);
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, userId: number): Promise<Task> {
    return this.tasksRepository.update(id, updateTaskDto, userId);
  }

  async remove(id: number, userId: number): Promise<void> {
    await this.tasksRepository.remove(id, userId);
  }
}