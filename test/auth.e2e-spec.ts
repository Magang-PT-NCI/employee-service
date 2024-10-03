import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';

describe('auth controller (e2e)', () => {
  const nik: string = '001230045600701';
  const password: string = 'adityawijaya123';
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('login', () => {
    it('should fail to perform login when nik is not provided', async () => {
      await request(app.getHttpServer())
        .post('/login')
        .send({ password })
        .expect(400)
        .expect({
          message: 'nik harus diisi!',
          error: 'Bad Request',
          statusCode: 400,
        });
    });

    it('should fail to perform login when password is not provided', async () => {
      await request(app.getHttpServer())
        .post('/login')
        .send({ nik })
        .expect(400)
        .expect({
          message: 'password harus diisi!',
          error: 'Bad Request',
          statusCode: 400,
        });
    });

    it('should fail to perform login when nik or password is invalid', async () => {
      await request(app.getHttpServer())
        .post('/login')
        .send({ nik, password: 'adit' })
        .expect(401)
        .expect({
          message: 'nik atau password salah!',
          error: 'Unauthorized',
          statusCode: 401,
        });
    });

    it('should success to perform login', async () => {
      const response = await request(app.getHttpServer())
        .post('/login')
        .send({ nik, password })
        .expect(200);

      expect(response.body.nik).toBe(nik);
      expect(response.body.user_role).toBe('OnSite');
      expect(response.body.profile_photo).toContain(
        'https://lh3.googleusercontent.com/d/',
      );
      expect(response.body.token).toBeDefined();
      expect(typeof response.body.token).toBe('string');
    });
  });

  describe('token validation', () => {
    it('should fail to validate token when token is not provided', async () => {
      await request(app.getHttpServer())
        .post('/validate_token')
        .expect(400)
        .expect({
          message: 'token harus diisi!',
          error: 'Bad Request',
          statusCode: 400,
        });
    });

    it('should fail to validate token when token is not valid', async () => {
      await request(app.getHttpServer())
        .post('/validate_token')
        .send({ token: 'abc' })
        .expect(401)
        .expect({
          message: 'token tidak valid!',
          error: 'Unauthorized',
          statusCode: 401,
        });
    });

    it('should success to validate token', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/login')
        .send({ nik, password })
        .expect(200);

      const response = await request(app.getHttpServer())
        .post('/validate_token')
        .send({ token: loginResponse.body.token })
        .expect(200);

      expect(response.body.nik).toBe(nik);
      expect(response.body.user_role).toBe('OnSite');
      expect(response.body.profile_photo).toContain(
        'https://lh3.googleusercontent.com/d/',
      );
    });
  });
});
