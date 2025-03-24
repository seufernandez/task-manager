import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { AppModule } from 'src/app.module';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let token: string;
  const username = `user${Date.now()}`;
  const password = 'test_password';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userRepository = moduleFixture.get(getRepositoryToken(User));
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /users/register', () => {
    it('should register a new user successfully', async () => {

      await request(app.getHttpServer())
        .post('/users/register')
        .send({ username, password })
        .expect(201);

      // Verify by logging in
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username, password })
        .expect(200);

      expect(loginResponse.body.access_token).toBeDefined();
      token = loginResponse.body.access_token;
      expect(token).toBeDefined();
    });

    it('should return 409 if username already exists', async () => {
      await request(app.getHttpServer())
        .post('/users/register')
        .send({ username, password })
        .expect(409);
    });

    it('should return 400 if username is missing', async () => {
      await request(app.getHttpServer())
        .post('/users/register')
        .send({ password: 'some_password' })
        .expect(400);
    });

    it('should return 400 if password is missing', async () => {
      await request(app.getHttpServer())
        .post('/users/register')
        .send({ username: 'some_username' })
        .expect(400);
    });

    it('should return 400 if both username and password are missing', async () => {
      await request(app.getHttpServer())
        .post('/users/register')
        .send({})
        .expect(400);
    });
  });

  describe('GET /users/me', () => {
    it('should return the user profile for an authenticated user', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/me')
        .auth(token, { type: 'bearer' })
        .expect(200);

      expect(response.body).toHaveProperty('username', username);
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 401 if no token is provided', async () => {
      await request(app.getHttpServer())
        .get('/users/me')
        .expect(401);
    });
  });
});