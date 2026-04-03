import { Test, TestingModule } from '@nestjs/testing';
import { MetricsService } from '../../../../commons/metrics.service';
import { ServicePort } from '../../domain/ports/service.port';
import { DeleteController } from './delete.controller';

describe('DeleteController', () => {
  let controller: DeleteController;
  let service: { delete: jest.Mock };
  let metricsService: { increment: jest.Mock };

  beforeEach(async () => {
    service = {
      delete: jest.fn().mockResolvedValue({ message: 'ok' }),
    };
    metricsService = {
      increment: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeleteController],
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

    controller = module.get<DeleteController>(DeleteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should delete a product by id', async () => {
    const dto = { id: '69cf4bd0ef8d4a8389765126' };

    await expect(controller.delete(dto)).resolves.toEqual({ message: 'ok' });
    expect(service.delete).toHaveBeenCalledWith(dto);
    expect(metricsService.increment).toHaveBeenCalledWith('controller.metric');
  });
});
