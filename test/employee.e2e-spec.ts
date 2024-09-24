import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('employee controller (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should fail to request /employee/:nik (GET) without api key', async () => {
    const nik: string = '001230045600701';
    await request(app.getHttpServer())
      .get(`/employee/${nik}`)
      .expect(400)
      .expect({
        message: 'api key harus dikirimkan!',
        error: 'Bad Request',
        statusCode: 400,
      });
  });

  it('should fail to request /employee/:nik (GET) with invalid api key', async () => {
    const nik: string = '001230045600701';
    await request(app.getHttpServer())
      .get(`/employee/${nik}`)
      .set('x-api-key', 'abc')
      .expect(400)
      .expect({
        message: 'api key tidak valid!',
        error: 'Bad Request',
        statusCode: 400,
      });
  });

  it('should success to request /employee/:nik (GET)', async () => {
    const nik: string = '001230045600701';
    const response = await request(app.getHttpServer())
      .get(`/employee/${nik}`)
      .set('x-api-key', '3f9cA1b7X5e4P8k9M2rQ6tJ8uY3sL7dZ')
      .expect(200);

    expect(response.body.nik).toBe(nik);
    expect(response.body.name).toBe('Aditya Wijaya Putra');
    expect(response.body.position).toBe('OnSite');
    expect(response.body.area).toBeDefined();
    expect(response.body.role).toBeDefined();
  });

  it('should fail to request /employee/:nik (GET) not exists nik', async () => {
    const nik: string = '001230045600700';
    await request(app.getHttpServer())
      .get(`/employee/${nik}`)
      .set('x-api-key', '3f9cA1b7X5e4P8k9M2rQ6tJ8uY3sL7dZ')
      .expect(404)
      .expect({
        message: 'karyawan tidak ditemukan!',
        error: 'Not Found',
        statusCode: 404,
      });
  });
});
