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

  it('should success to request /employee/:nik (GET)', async () => {
    const nik = '001230045600701';
    const response = await request(app.getHttpServer())
      .get(`/employee/${nik}`)
      .expect(200);

    expect(response.body.nik).toBe(nik);
    expect(response.body.name).toBe('Aditya Wijaya Putra');
    expect(response.body.position).toBe('OnSite');
    expect(response.body.profile_photo).toBe(
      'https://lh3.googleusercontent.com/d/17ZxcvViTexCuS_j_Vve2CKTyHG7iu0aY=s220',
    );
    expect(response.body.area).toBeDefined();
    expect(response.body.role).toBeDefined();
  });

  it('should fail to request /employee/:nik (GET) not exists nik', async () => {
    const nik = '001230045600700';
    await request(app.getHttpServer())
      .get(`/employee/${nik}`)
      .expect(404)
      .expect({
        message: 'Karyawan tidak ditemukan!',
        error: 'Not Found',
        statusCode: 404,
      });
  });
});
