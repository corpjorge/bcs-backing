import { Test, TestingModule } from '@nestjs/testing';
import { ReadController } from './read.controller';
import { ServicePort } from '../../domain/ports/service.port';

describe('ReadController', () => {
  let controller: ReadController;
  let service: { create: jest.Mock };

  beforeEach(async () => {
    service = {
      create: jest.fn().mockResolvedValue({
        documentType: 'CC',
        documentNumber: 12345678,
        username: 'test',
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReadController],
      providers: [
        {
          provide: ServicePort,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<ReadController>(ReadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return ok', async () => {
    const payload = {
      documentType: 'CC',
      documentNumber: 12345678,
      password: '1234',
    };

    await expect(controller.create(payload as never)).resolves.toEqual({
      documentType: 'CC',
      documentNumber: 12345678,
      username: 'test',
    });
    expect(service.create).toHaveBeenCalledWith(payload);
  });
});
