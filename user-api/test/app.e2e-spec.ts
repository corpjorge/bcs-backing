import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';

describe('User API (e2e smoke)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should boot and respond 404 for an unknown route', () => {
    return request(app.getHttpServer()).get('/v1/health').expect(404);
  });

  afterEach(async () => {
    await app.close();
  });
});
