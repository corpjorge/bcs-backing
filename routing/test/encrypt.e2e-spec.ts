import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { MetricsService } from '../src/commons/metrics.service';
import { CryptoService } from '../src/commons/encrypt';
import { EncryptController } from '../src/routes/encrypt/encrypt.controller';

describe('EncryptController (e2e)', () => {
  let app: INestApplication<App>;
  const crypto = {
    encrypt: jest.fn(),
    decrypt: jest.fn(),
  };
  const metricsService = {
    increment: jest.fn(),
  };

  beforeEach(async () => {
    crypto.encrypt.mockReset();
    crypto.decrypt.mockReset();
    metricsService.increment.mockReset();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [EncryptController],
      providers: [
        {
          provide: CryptoService,
          useValue: crypto,
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

  it('POST /encrypt returns the same payload and increments metrics', async () => {
    const payload = { hello: 'world' };

    await request(app.getHttpServer())
      .post('/encrypt')
      .send(payload)
      .expect(201)
      .expect(payload);

    expect(metricsService.increment).toHaveBeenCalledWith('controller.metric');
  });

  it('POST /decrypt returns the decrypted payload and increments metrics', async () => {
    const payload = {
      iv: 'iv',
      tag: 'tag',
      data: 'data',
    };
    const response = { hello: 'world' };

    crypto.decrypt.mockReturnValue(response);

    await request(app.getHttpServer())
      .post('/decrypt')
      .send(payload)
      .expect(201)
      .expect(response);

    expect(crypto.decrypt).toHaveBeenCalledWith(payload);
    expect(metricsService.increment).toHaveBeenCalledWith('controller.metric');
  });

  afterEach(async () => {
    await app.close();
  });
});

