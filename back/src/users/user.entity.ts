import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
import { Task } from '../tasks/task.entity';

@Entity('users')
export class User {
  @ApiProperty({
    description: 'Unique user identifier',
    example: 1
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Username for authentication',
    example: 'john_doe'
  })
  @Column({ unique: true })
  username: string;

  @ApiHideProperty()
  @Column()
  password: string;

  @ApiProperty({
    description: 'Date when the user account was created',
    example: '2023-01-15T10:00:00Z'
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the user account was last updated',
    example: '2023-01-20T15:30:00Z'
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiHideProperty()
  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];
}