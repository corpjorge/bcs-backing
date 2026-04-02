import { MulesoftController } from './mulesoft.controller';

describe('ProductController', () => {
  let controller: MulesoftController;
  let service: { get: jest.Mock };

  beforeEach(() => {
    service = {
      get: jest.fn(),
    };

    controller = new MulesoftController(service as never);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should delegate to service and return response', async () => {
    const payload = {
      productType: 'MORTGAGE_CDT',
      documentTypeCedula: 'CC12345678',
      amount: 1000000,
      term: 12,
    };
    const response = { message: 'ok' };

    service.get.mockResolvedValue(response);

    await expect(controller.get(payload as never)).resolves.toEqual(response);
    expect(service.get).toHaveBeenCalledWith(payload);
  });

  it('should propagate service errors', async () => {
    const payload = {
      productType: 'MORTGAGE_CDT',
      documentTypeCedula: 'CC12345678',
      amount: 1000000,
      term: 12,
    };
    const error = new Error('boom');

    service.get.mockRejectedValue(error);

    await expect(controller.get(payload as never)).rejects.toThrow('boom');
  });
});
