import { RegistrationService } from './registration.service';

describe('RegistrationService', () => {
  let service: RegistrationService;
  let repository: { create: jest.Mock };

  beforeEach(() => {
    repository = {
      create: jest.fn(),
    };

    service = new RegistrationService(repository as never);
  });

  it('should delegate to repository and return the response', async () => {
    const payload = {
      documentType: 'CC',
      documentNumber: 12345678,
      username: 'jorge',
      password: '123456',
    };
    const response = { message: 'ok' };

    repository.create.mockResolvedValue(response);

    await expect(service.create(payload as never)).resolves.toEqual(response);
    expect(repository.create).toHaveBeenCalledWith(payload);
  });

  it('should propagate repository errors', async () => {
    const payload = {
      documentType: 'CC',
      documentNumber: 12345678,
      username: 'jorge',
      password: '123456',
    };
    const error = new Error('boom');

    repository.create.mockRejectedValue(error);

    await expect(service.create(payload as never)).rejects.toThrow('boom');
  });
});

