import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { ReadController } from '../src/api/read/infrastructure/controllers/read.controller';
import { ServicePort } from '../src/api/read/domain/ports/service.port';

describe('ReadController (e2e)', () => {
  let app: INestApplication<App>;
  const service = {
    read: jest.fn(),
  };

  beforeEach(async () => {
    service.read.mockReset();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ReadController],
      providers: [
        {
          provide: ServicePort,
          useValue: service,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('GET /v1/read returns the service response', async () => {
    const response = { message: 'ok', data: { user: 'abc123' } };
    service.read.mockResolvedValue(response);

    await request(app.getHttpServer())
      .get('/v1/read')
      .query({ user: 'abc123' })
      .expect(200)
      .expect(response);

    expect(service.read).toHaveBeenCalledWith({ user: 'abc123' });
  });

  it('GET /v1/read returns 400 for invalid user', async () => {
    await request(app.getHttpServer())
      .get('/v1/read')
      .query({ user: 'bad-user!' })
      .expect(400);

    expect(service.read).not.toHaveBeenCalled();
  });

  afterEach(async () => {
    await app.close();
  });
});

