import { Test, TestingModule } from '@nestjs/testing';
import { RegistrationController } from './registration.controller';
import { ServicePort } from '../../domain/ports/service.port';
import { MetricsService } from '../../../../commons/metrics.service';

describe('RegistrationControllerTsController', () => {
  let controller: RegistrationController;
  let service: { create: jest.Mock };
  let metricsService: { increment: jest.Mock };

  beforeEach(async () => {
    service = {
      create: jest.fn().mockResolvedValue({ message: 'ok' }),
    };

    metricsService = {
      increment: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
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

    controller = module.get<RegistrationController>(RegistrationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return ok', async () => {
    const payload = {
      documentType: 'CC',
      documentNumber: 12345678,
      username: 'jorge',
      password: '123456',
    };

    await expect(controller.create(payload as never)).resolves.toEqual({
      message: 'ok',
    });
    expect(service.create).toHaveBeenCalledWith(payload);
  });
});
