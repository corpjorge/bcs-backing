import { RegistrationController } from './registration.controller';

describe('RegistrationController', () => {
  let controller: RegistrationController;
  let service: { create: jest.Mock };
  let metricsService: { increment: jest.Mock };

  beforeEach(() => {
    service = {
      create: jest.fn(),
    };

    metricsService = {
      increment: jest.fn(),
    };

    controller = new RegistrationController(
      service as never,
      metricsService as never,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should delegate to service, emit metric and return response', async () => {
    const payload = {
      documentType: 'CC',
      documentNumber: 12345678,
      username: 'jorge',
      password: '123456',
    };
    const response = { message: 'ok' };

    service.create.mockResolvedValue(response);

    await expect(controller.create(payload as never)).resolves.toEqual(response);
    expect(service.create).toHaveBeenCalledWith(payload);
    expect(metricsService.increment).toHaveBeenCalledWith('controller.metric');
  });

  it('should propagate service errors and still emit metric', async () => {
    const payload = {
      documentType: 'CC',
      documentNumber: 12345678,
      username: 'jorge',
      password: '123456',
    };
    const error = new Error('boom');

    service.create.mockRejectedValue(error);

    await expect(controller.create(payload as never)).rejects.toThrow('boom');
    expect(metricsService.increment).toHaveBeenCalledWith('controller.metric');
  });
});
