import { MongoRepository } from './mongo.repository';

jest.mock('@opentelemetry/api-logs', () => ({
  logs: {
    getLogger: () => ({
      emit: jest.fn(),
    }),
  },
}));

describe('MongoRepository', () => {
  it('should persist a product and return ok', async () => {
    const productModel: { create: jest.Mock } = {
      create: jest.fn().mockResolvedValue(undefined),
    };

    const repository = new MongoRepository(productModel as never);
    const payload = {
      productType: 'CDT',
      user: 12345678,
      amount: 1000000,
      term: 12,
    };

    await expect(repository.create(payload as never)).resolves.toEqual({
      message: 'ok',
    });
    expect(productModel.create).toHaveBeenCalledWith(payload);
  });
});
