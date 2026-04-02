import { RegistrationService } from './registration.service';

describe('ProductService', () => {
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
      productType: 'CDT',
      userDocument: 12345678,
      amount: 1000000,
      term: 12,
    };
    const response = { message: 'ok' };

    repository.create.mockResolvedValue(response);

    await expect(service.create(payload as never)).resolves.toEqual(response);
    expect(repository.create).toHaveBeenCalledWith(payload);
  });

  it('should propagate repository errors', async () => {
    const payload = {
      productType: 'CDT',
      userDocument: 12345678,
      amount: 1000000,
      term: 12,
    };
    const error = new Error('boom');

    repository.create.mockRejectedValue(error);

    await expect(service.create(payload as never)).rejects.toThrow('boom');
  });
});
