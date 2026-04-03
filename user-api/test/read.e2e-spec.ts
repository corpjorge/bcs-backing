import { INestApplication, UnauthorizedException } from '@nestjs/common';
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

  it('POST /v1/read returns the user data for valid credentials', async () => {
    const payload = {
      documentType: 'CC',
      documentNumber: 12345678,
      password: '123456',
    };
    const response = {
      documentType: 'CC',
      documentNumber: 12345678,
      username: 'jorge',
    };

    service.read.mockResolvedValue(response);

    await request(app.getHttpServer())
      .post('/v1/read')
      .send(payload)
      .expect(200)
      .expect(response);

    expect(service.read).toHaveBeenCalledWith(payload);
  });

  it('POST /v1/read returns 400 for invalid body', async () => {
    await request(app.getHttpServer()).post('/v1/read').send({}).expect(400);

    expect(service.read).not.toHaveBeenCalled();
  });

  it('POST /v1/read returns 401 for invalid credentials', async () => {
    const payload = {
      documentType: 'CC',
      documentNumber: 12345678,
      password: '123456',
    };

    service.read.mockRejectedValue(
      new UnauthorizedException('invalid credentials'),
    );

    await request(app.getHttpServer())
      .post('/v1/read')
      .send(payload)
      .expect(401);

    expect(service.read).toHaveBeenCalledWith(payload);
  });

  afterEach(async () => {
    await app.close();
  });
});

