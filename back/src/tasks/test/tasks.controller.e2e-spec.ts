import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Task } from '../task.entity';
import { AppModule } from 'src/app.module';

describe('TasksController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let taskRepository: Repository<Task>;
  let testUser: User;
  let token: string;
  const username = `User.${Date.now()}`;
  const password = `secret`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userRepository = moduleFixture.get(getRepositoryToken(User));
    taskRepository = moduleFixture.get(getRepositoryToken(Task));

    await request(app.getHttpServer())
      .post('/users/register')
      .send({ username, password })
      .expect(201);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username, password })
      .expect(200);

    token = loginResponse.body.access_token;
    expect(token).toBeDefined();

    const user = await userRepository.findOne({ where: { username } });
    if (!user) {
      throw new Error(`User with username '${username}' not found`);
    }
    testUser = user;    
    expect(testUser).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await taskRepository.clear();
  });

  describe('GET /tasks', () => {
    it('should return an array of tasks for the authenticated user', async () => {
      await taskRepository.save([
        { title: 'Task 1', description: 'Desc 1', user: testUser },
        { title: 'Task 2', description: 'Desc 2', user: testUser },
      ]);

      const response = await request(app.getHttpServer())
        .get('/tasks')
        .auth(token, { type: 'bearer' })
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('title', 'Task 1');
      expect(response.body[1]).toHaveProperty('title', 'Task 2');
    });

  });

  describe('GET /tasks/:id', () => {
    it('should return a task by ID for the authenticated user', async () => {
      const task = await taskRepository.save({
        title: 'Task',
        description: 'Desc',
        user: testUser,
      });

      const response = await request(app.getHttpServer())
        .get(`/tasks/${task.id}`)
        .auth(token, { type: 'bearer' })
        .expect(200);

      expect(response.body.title).toBe('Task');
      expect(response.body.description).toBe('Desc');
    });

    it('should return 404 for a non-existent task', async () => {
      await request(app.getHttpServer())
        .get('/tasks/999')
        .auth(token, { type: 'bearer' })
        .expect(404);
    });
  });

  describe('POST /tasks', () => {
    it('should create a new task for the authenticated user', async () => {
      const createTaskDto = { title: 'New Task', description: 'New Desc' };

      const response = await request(app.getHttpServer())
        .post('/tasks')
        .auth(token, { type: 'bearer' })
        .send(createTaskDto)
        .expect(201);

      const createdTask = await taskRepository.findOne({
        where: { id: response.body.id },
        relations: ['user'],
      });
      if (!createdTask) {
        throw new Error(`Task  not found`);
      }
      expect(createdTask).toBeDefined();
      expect(createdTask.title).toBe('New Task');
      expect(createdTask.user.id).toBe(testUser.id);
    });
  });

  describe('PUT /tasks/:id', () => {
    it('should update an existing task', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/tasks')
        .auth(token, { type: 'bearer' })
        .send({ title: 'Original', description: 'Original Desc' })
        .expect(201);

      const taskId = createResponse.body.id;
      const updateTaskDto = { title: 'Updated Title' };

      await request(app.getHttpServer())
        .put(`/tasks/${taskId}`)
        .auth(token, { type: 'bearer' })
        .send(updateTaskDto)
        .expect(200);

      const updatedTask = await taskRepository.findOne({
        where: { id: taskId },
      });
      if (!updatedTask) {
        throw new Error(`Task  not found`);
      }
      expect(updatedTask.title).toBe('Updated Title');
      expect(updatedTask.description).toBe('Original Desc');
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete an existing task', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/tasks')
        .auth(token, { type: 'bearer' })
        .send({ title: 'To Delete', description: 'Desc' })
        .expect(201);

      const taskId = createResponse.body.id;

      await request(app.getHttpServer())
        .delete(`/tasks/${taskId}`)
        .auth(token, { type: 'bearer' })
        .expect(204);

      const deletedTask = await taskRepository.findOne({
        where: { id: taskId },
      });
      expect(deletedTask).toBeNull();
    });
  });

  describe('Authentication', () => {
    it('should return 401 if no token is provided', async () => {
      await request(app.getHttpServer()).get('/tasks').expect(401);
    });
  });

  it('should create, update, and delete a task successfully', async () => {
    // Create a task
    const createResponse = await request(app.getHttpServer())
      .post('/tasks')
      .auth(token, { type: 'bearer' })
      .send({ title: 'Initial Title', description: 'Initial Desc' })
      .expect(201);

    const taskId = createResponse.body.id;

    // Fetch the task
    const getResponse = await request(app.getHttpServer())
      .get(`/tasks/${taskId}`)
      .auth(token, { type: 'bearer' })
      .expect(200);

    expect(getResponse.body.title).toBe('Initial Title');

    // Update the task
    await request(app.getHttpServer())
      .put(`/tasks/${taskId}`)
      .auth(token, { type: 'bearer' })
      .send({ title: 'Updated Title' })
      .expect(200);

    // Verify update
    const updatedGetResponse = await request(app.getHttpServer())
      .get(`/tasks/${taskId}`)
      .auth(token, { type: 'bearer' })
      .expect(200);

    expect(updatedGetResponse.body.title).toBe('Updated Title');

    // Delete the task
    await request(app.getHttpServer())
      .delete(`/tasks/${taskId}`)
      .auth(token, { type: 'bearer' })
      .expect(204);

    // Verify deletion
    await request(app.getHttpServer())
      .get(`/tasks/${taskId}`)
      .auth(token, { type: 'bearer' })
      .expect(404);
  });
});