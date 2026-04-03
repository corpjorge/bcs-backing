import { ProductRepository } from './mongo.repository';

jest.mock('@opentelemetry/api-logs', () => ({
  logs: {
    getLogger: () => ({
      emit: jest.fn(),
    }),
  },
}));

describe('MongoRepository', () => {
  it('should search all products for a user and return ok with data', async () => {
    const foundProducts = [
      {
        productType: 'MORTGAGE_CDT',
        user: 'CC12345678',
        amount: 1000000,
        term: 12,
      },
      {
        productType: 'SAVINGS_ACCOUNT',
        user: 'CC12345678',
        amount: 500000,
        term: 6,
      },
    ];

    const productModel: { find: jest.Mock } = {
      find: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(foundProducts),
      }),
    };

    const repository = new ProductRepository(productModel as never);
    const payload = {
      user: 'CC12345678',
    };

    await expect(repository.read(payload as never)).resolves.toEqual({
      message: 'ok',
      data: foundProducts,
    });
    expect(productModel.find).toHaveBeenCalledWith({
      user: payload.user,
    });
  });

  it('should return an empty list when the user has no products', async () => {
    const productModel: { find: jest.Mock } = {
      find: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      }),
    };

    const repository = new ProductRepository(productModel as never);
    const payload = {
      user: 'CC12345678',
    };

    await expect(repository.read(payload as never)).resolves.toEqual({
      message: 'ok',
      data: [],
    });
    expect(productModel.find).toHaveBeenCalledWith({
      user: payload.user,
    });
  });
});
