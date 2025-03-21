import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ description: 'The task title' })
  @IsNotEmpty({ message: 'The task title is required' })
  @IsString({ message: 'The title must be a string' })
  title: string;

  @ApiPropertyOptional({ description: 'The task description' })
  @IsOptional()
  @IsString({ message: 'The description must be a string' })
  description?: string;

  @ApiPropertyOptional({ description: 'Task completion status (completed or not)' })
  @IsOptional()
  @IsBoolean({ message: 'The completion status must be a boolean' })
  completed?: boolean;
}
