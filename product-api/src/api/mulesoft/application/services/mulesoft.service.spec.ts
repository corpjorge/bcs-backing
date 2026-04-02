import { MulesoftService } from './mulesoft.service';

describe('MulesoftService', () => {
  let service: MulesoftService;
  let cache: { get: jest.Mock; set: jest.Mock };
  let repository: { get: jest.Mock };

  beforeEach(() => {
    cache = {
      get: jest.fn(),
      set: jest.fn(),
    };
    repository = {
      get: jest.fn(),
    };

    service = new MulesoftService(cache as never, repository as never);
  });

  it('should return cached data when cache has products', async () => {
    const payload = { user: 'CC12345678' };
    const cached = { message: 'ok', data: [{ id: 'cached' }] };

    cache.get.mockResolvedValue(cached);

    await expect(service.get(payload as never)).resolves.toEqual(cached);
    expect(cache.get).toHaveBeenCalledWith(payload);
    expect(repository.get).not.toHaveBeenCalled();
    expect(cache.set).not.toHaveBeenCalled();
  });

  it('should call repository and store in cache when cache is empty', async () => {
    const payload = { user: 'CC12345678' };

    cache.get.mockResolvedValue({ message: 'ok', data: [] });
    repository.get.mockResolvedValue({ message: 'ok', data: { id: 'source' } });
    cache.set.mockResolvedValue({ message: 'ok', data: [{ id: 'source' }] });

    await expect(service.get(payload as never)).resolves.toEqual({
      message: 'ok',
      data: [{ id: 'source' }],
    });

    expect(repository.get).toHaveBeenCalledWith(payload);
    expect(cache.set).toHaveBeenCalledWith(payload, [{ id: 'source' }]);
  });

  it('should propagate cache errors', async () => {
    const payload = { user: 'CC12345678' };
    const error = new Error('boom');

    cache.get.mockRejectedValue(error);

    await expect(service.get(payload as never)).rejects.toThrow('boom');
  });
});
