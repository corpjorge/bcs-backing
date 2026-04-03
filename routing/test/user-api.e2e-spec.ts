import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { MetricsService } from '../src/commons/metrics.service';
import { UserApiController } from '../src/routes/user-api/user-api.controller';
import { UserApiService } from '../src/routes/user-api/user-api.service';

describe('UserApiController (e2e)', () => {
  let app: INestApplication<App>;
  const service = {
    sendUserData: jest.fn(),
    readUserData: jest.fn(),
  };
  const metricsService = {
    increment: jest.fn(),
  };

  beforeEach(async () => {
    service.sendUserData.mockReset();
    service.readUserData.mockReset();
    metricsService.increment.mockReset();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UserApiController],
      providers: [
        {
          provide: UserApiService,
          useValue: service,
        },
        {
          provide: MetricsService,
          useValue: metricsService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('POST /users-api/v1/registration returns the service response and increments metrics', async () => {
    const payload = {
      documentType: 'CC',
      documentNumber: 12345678,
      username: 'jorge',
      password: '123456',
    };
    const response = { message: 'ok' };

    service.sendUserData.mockResolvedValue(response);

    await request(app.getHttpServer())
      .post('/users-api/v1/registration')
      .send(payload)
      .expect(201)
      .expect(response);

    expect(metricsService.increment).toHaveBeenCalledWith('controller.metric');
    expect(service.sendUserData).toHaveBeenCalledWith(payload);
  });

  it('POST /users-api/v1/read returns the service response and increments metrics', async () => {
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

    service.readUserData.mockResolvedValue(response);

    await request(app.getHttpServer())
      .post('/users-api/v1/read')
      .send(payload)
      .expect(201)
      .expect(response);

    expect(metricsService.increment).toHaveBeenCalledWith('controller.metric');
    expect(service.readUserData).toHaveBeenCalledWith(payload);
  });

  afterEach(async () => {
    await app.close();
  });
});

