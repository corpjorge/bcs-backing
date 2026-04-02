import { ReadService } from './read.service';

describe('ReadService', () => {
  let service: ReadService;
  let repository: { read: jest.Mock };

  beforeEach(() => {
    repository = {
      read: jest.fn(),
    };

    service = new ReadService(repository as never);
  });

  it('should delegate to repository and return the response', async () => {
    const payload = {
      documentType: 'CC',
      documentNumber: 12345678,
      password: '1234',
    };
    const response = {
      documentType: 'CC',
      documentNumber: 12345678,
      username: 'test',
    };

    repository.read.mockResolvedValue(response);

    await expect(service.read(payload as never)).resolves.toEqual(response);
    expect(repository.read).toHaveBeenCalledWith(payload);
  });

  it('should propagate repository errors', async () => {
    const payload = {
      documentType: 'CC',
      documentNumber: 12345678,
      password: '1234',
    };
    const error = new Error('boom');

    repository.read.mockRejectedValue(error);

    await expect(service.read(payload as never)).rejects.toThrow('boom');
  });
});

