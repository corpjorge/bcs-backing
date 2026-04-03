import { ConflictException, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { RegistrationController } from '../src/api/registration/infrastructure/controllers/registration.controller';
import { ServicePort } from '../src/api/registration/domain/ports/service.port';
import { MetricsService } from '../src/commons/metrics.service';

describe('RegistrationController (e2e)', () => {
  let app: INestApplication<App>;
  const service = {
    create: jest.fn(),
  };
  const metricsService = {
    increment: jest.fn(),
  };

  beforeEach(async () => {
    service.create.mockReset();
    metricsService.increment.mockReset();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [RegistrationController],
      providers: [
        {
          provide: ServicePort,
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

  it('POST /v1/registration returns the service response and increments metrics', async () => {
    const payload = {
      documentType: 'CC',
      documentNumber: 12345678,
      username: 'jorge',
      password: '123456',
    };
    const response = { message: 'ok' };

    service.create.mockResolvedValue(response);

    await request(app.getHttpServer())
      .post('/v1/registration')
      .send(payload)
      .expect(200)
      .expect(response);

    expect(metricsService.increment).toHaveBeenCalledWith('controller.metric');
    expect(service.create).toHaveBeenCalledWith(payload);
  });

  it('POST /v1/registration returns 400 for invalid body', async () => {
    await request(app.getHttpServer())
      .post('/v1/registration')
      .send({})
      .expect(400);

    expect(metricsService.increment).not.toHaveBeenCalled();
    expect(service.create).not.toHaveBeenCalled();
  });

  it('POST /v1/registration returns 409 when the document already exists', async () => {
    const payload = {
      documentType: 'CC',
      documentNumber: 12345678,
      username: 'jorge',
      password: '123456',
    };

    service.create.mockRejectedValue(
      new ConflictException('documentNumber already exists'),
    );

    await request(app.getHttpServer())
      .post('/v1/registration')
      .send(payload)
      .expect(409);

    expect(metricsService.increment).toHaveBeenCalledWith('controller.metric');
    expect(service.create).toHaveBeenCalledWith(payload);
  });

  afterEach(async () => {
    await app.close();
  });
});

