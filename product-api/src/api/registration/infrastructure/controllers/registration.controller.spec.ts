import { RegistrationController } from './registration.controller';

describe('ProductController', () => {
  let controller: RegistrationController;
  let service: { create: jest.Mock };

  beforeEach(() => {
    service = {
      create: jest.fn(),
    };

    controller = new RegistrationController(service as never);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should delegate to service and return response', async () => {
    const payload = {
      productType: 'CDT',
      userDocument: 12345678,
      amount: 1000000,
      term: 12,
    };
    const response = { message: 'ok' };

    service.create.mockResolvedValue(response);

    await expect(controller.create(payload as never)).resolves.toEqual(
      response,
    );
    expect(service.create).toHaveBeenCalledWith(payload);
  });

  it('should propagate service errors', async () => {
    const payload = {
      productType: 'CDT',
      userDocument: 12345678,
      amount: 1000000,
      term: 12,
    };
    const error = new Error('boom');

    service.create.mockRejectedValue(error);

    await expect(controller.create(payload as never)).rejects.toThrow('boom');
  });
});
