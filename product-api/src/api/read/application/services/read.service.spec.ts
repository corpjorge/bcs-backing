import { ReadService } from './read.service';

describe('ProductService', () => {
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
      productType: 'MORTGAGE_CDT',
      documentTypeCedula: 'CC12345678',
      amount: 1000000,
      term: 12,
    };
    const response = { message: 'ok' };

    repository.read.mockResolvedValue(response);

    await expect(service.read(payload as never)).resolves.toEqual(response);
    expect(repository.read).toHaveBeenCalledWith(payload);
  });

  it('should propagate repository errors', async () => {
    const payload = {
      productType: 'MORTGAGE_CDT',
      documentTypeCedula: 'CC12345678',
      amount: 1000000,
      term: 12,
    };
    const error = new Error('boom');

    repository.read.mockRejectedValue(error);

    await expect(service.read(payload as never)).rejects.toThrow('boom');
  });
});
