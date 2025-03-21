import { ConflictException, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  
  async create(username: string, password: string): Promise<void> {
    const existingUser = await this.usersRepository.findOne(username);
    if (existingUser) {
      throw new ConflictException('Username already exists, set up a new one and try again');
    }
  
    await this.usersRepository.create(username, password);
  }

  async findOne(username: string): Promise<User | null> {
    return this.usersRepository.findOne(username);
  }

  async findById(id: number): Promise<Omit<User, 'password'> | null> {
    return this.usersRepository.findById(id);
  }
}
