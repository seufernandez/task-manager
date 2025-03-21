import { IsOptional, IsString, IsBoolean, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiPropertyOptional({ description: 'The task title' })
  @IsOptional()
  @IsString({ message: 'The title must be a string' })
  title?: string;

  @ApiPropertyOptional({ description: 'The task description' })
  @IsOptional()
  @IsString({ message: 'The description must be a string' })
  description?: string;

  @ApiPropertyOptional({ description: 'Task completion status (completed or not)' })
  @IsOptional()
  @IsBoolean({ message: 'The completion status must be a boolean' })
  completed?: boolean;

}
