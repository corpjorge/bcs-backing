import { INestApplication, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AuthController } from '../src/auth/auth.controller';
import { AuthService } from '../src/auth/auth.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication<App>;
  const authService = {
    signIn: jest.fn(),
  };

  beforeEach(async () => {
    authService.signIn.mockReset();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('POST /auth/login returns the token and forwards the payload', async () => {
    const payload = {
      documentType: 'CC',
      documentNumber: 12345678,
      password: '123456',
    };
    const response = { access_token: 'jwt-token' };

    authService.signIn.mockResolvedValue(response);

    await request(app.getHttpServer())
      .post('/auth/login')
      .send(payload)
      .expect(200)
      .expect(response);

    expect(authService.signIn).toHaveBeenCalledWith(payload);
  });

  it('POST /auth/login returns 401 when the service rejects with UnauthorizedException', async () => {
    const payload = {
      documentType: 'CC',
      documentNumber: 12345678,
      password: 'wrong-password',
    };

    authService.signIn.mockRejectedValue(new UnauthorizedException());

    await request(app.getHttpServer())
      .post('/auth/login')
      .send(payload)
      .expect(401);

    expect(authService.signIn).toHaveBeenCalledWith(payload);
  });

  afterEach(async () => {
    await app.close();
  });
});

