import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { Task } from '../tasks/task.entity';

async function seed() {

  const dataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'your_username',
    password: 'your_password',
    database: 'todo_list',
    entities: [User, Task],
    synchronize: true,
  });

  await dataSource.initialize();

  const userRepository = dataSource.getRepository(User);
  const taskRepository = dataSource.getRepository(Task);

  const user1 = userRepository.create({
    username: 'john_doe',
    password: await bcrypt.hash('password123', 10),
  });

  const user2 = userRepository.create({
    username: 'jane_doe',
    password: await bcrypt.hash('password456', 10),
  });

  await userRepository.save([user1, user2]);

  const task1 = taskRepository.create({
    title: 'Comprar leite',
    description: 'Ir ao mercado e comprar leite',
    completed: false,
    user: user1,
  });

  const task2 = taskRepository.create({
    title: 'Projeto NestJS',
    description: 'Finalizar o projeto de To-Do List',
    completed: true,
    user: user2,
  });

  await taskRepository.save([task1, task2]);

  console.log('Seed Complete!');

  await dataSource.destroy();
}

seed().catch((error) => console.error('Error running seed:', error));
