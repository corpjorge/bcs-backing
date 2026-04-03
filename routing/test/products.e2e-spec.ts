import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';
import { App } from 'supertest/types';
import { AuthGuard } from '../src/auth/auth.guard';
import { MetricsService } from '../src/commons/metrics.service';
import { ProductsController } from '../src/routes/products/products.controller';
import { ProductsService } from '../src/routes/products/products.service';

describe('ProductsController (e2e)', () => {
  let app: INestApplication<App>;
  const service = {
    getProducts: jest.fn(),
    readProducts: jest.fn(),
    createProduct: jest.fn(),
  };
  const metricsService = {
    increment: jest.fn(),
  };
  const jwtService = {
    verifyAsync: jest.fn(),
  };

  beforeEach(async () => {
    service.getProducts.mockReset();
    service.readProducts.mockReset();
    service.createProduct.mockReset();
    metricsService.increment.mockReset();
    jwtService.verifyAsync.mockReset();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: service,
        },
        {
          provide: MetricsService,
          useValue: metricsService,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
        AuthGuard,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('GET /products/v1/products returns the service response and increments metrics', async () => {
    const response = [{ productType: 'CDT' }];
    const query = { user: 'abc123' };

    service.getProducts.mockResolvedValue(response);

    await request(app.getHttpServer())
      .get('/products/v1/products')
      .query(query)
      .expect(200)
      .expect(response);

    expect(metricsService.increment).toHaveBeenCalledWith('controller.metric');
    expect(service.getProducts).toHaveBeenCalledWith(query);
  });

  it('GET /products/v1/read returns 401 without a bearer token', async () => {
    await request(app.getHttpServer()).get('/products/v1/read').expect(401);

    expect(service.readProducts).not.toHaveBeenCalled();
  });

  it('GET /products/v1/read returns the service response with a valid bearer token', async () => {
    const response = [{ productType: 'CDT' }];
    const query = { user: 'abc123' };

    jwtService.verifyAsync.mockResolvedValue({ sub: 'abc123' });
    service.readProducts.mockResolvedValue(response);

    await request(app.getHttpServer())
      .get('/products/v1/read')
      .set('Authorization', 'Bearer valid-token')
      .query(query)
      .expect(200)
      .expect(response);

    expect(jwtService.verifyAsync).toHaveBeenCalledWith('valid-token');
    expect(metricsService.increment).toHaveBeenCalledWith('controller.metric');
    expect(service.readProducts).toHaveBeenCalledWith(query);
  });

  it('POST /products/v1/registration returns the service response and increments metrics', async () => {
    const payload = {
      productType: 'CDT',
      user: 'abc123',
      amount: 100,
      term: 12,
    };
    const response = { message: 'ok' };

    service.createProduct.mockResolvedValue(response);

    await request(app.getHttpServer())
      .post('/products/v1/registration')
      .send(payload)
      .expect(201)
      .expect(response);

    expect(metricsService.increment).toHaveBeenCalledWith('controller.metric');
    expect(service.createProduct).toHaveBeenCalledWith(payload);
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });
});

