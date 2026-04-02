import { RedisRepository } from './redis.repository';

jest.mock('@opentelemetry/api-logs', () => ({
  logs: {
    getLogger: () => ({
      emit: jest.fn(),
    }),
  },
}));

describe('RedisRepository', () => {
  it('should return empty list when user is not cached', async () => {
    const redisClient = {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn(),
    };
    const redisRepository = new RedisRepository(redisClient as never);

    await expect(redisRepository.get({ user: 'CC12345' })).resolves.toEqual({
      message: 'ok',
      data: [],
    });
    expect(redisClient.get).toHaveBeenCalledWith('mulesoft:products:CC12345');
  });

  it('should store and return cached products by user', async () => {
    const products = [{ id: 'p1' }, { id: 'p2' }];
    const redisClient = {
      get: jest.fn().mockResolvedValue(JSON.stringify(products)),
      set: jest.fn().mockResolvedValue('OK'),
    };

    const redisRepository = new RedisRepository(redisClient as never);
    const payload = { user: 'CC12345' };

    await expect(redisRepository.set(payload, products)).resolves.toEqual({
      message: 'ok',
      data: products,
    });

    await expect(redisRepository.get(payload)).resolves.toEqual({
      message: 'ok',
      data: products,
    });

    expect(redisClient.set).toHaveBeenCalledWith(
      'mulesoft:products:CC12345',
      JSON.stringify(products),
    );
  });
});

