import { ProductRepository } from './mongo.repository';

jest.mock('@opentelemetry/api-logs', () => ({
  logs: {
    getLogger: () => ({
      emit: jest.fn(),
    }),
  },
}));

describe('MongoRepository', () => {
  it('should search a product and return ok with data', async () => {
    const foundProduct = {
      productType: 'MORTGAGE_CDT',
      user: 'CC12345678',
      amount: 1000000,
      term: 12,
    };

    const productModel: { findOne: jest.Mock } = {
      findOne: jest.fn().mockResolvedValue(foundProduct),
    };

    const repository = new ProductRepository(productModel as never);
    const payload = {
      productType: 'MORTGAGE_CDT',
      user: 'CC12345678',
      amount: 1000000,
      term: 12,
    };

    await expect(repository.read(payload as never)).resolves.toEqual({
      message: 'ok',
      data: foundProduct,
    });
    expect(productModel.findOne).toHaveBeenCalledWith({
      user: payload.user,
    });
  });
});
