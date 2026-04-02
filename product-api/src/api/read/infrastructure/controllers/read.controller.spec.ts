import { ReadController } from './read.controller';

describe('ProductController', () => {
  let controller: ReadController;
  let service: { read: jest.Mock };

  beforeEach(() => {
    service = {
      read: jest.fn(),
    };

    controller = new ReadController(service as never);
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

    service.read.mockResolvedValue(response);

    await expect(controller.read(payload as never)).resolves.toEqual(response);
    expect(service.read).toHaveBeenCalledWith(payload);
  });

  it('should propagate service errors', async () => {
    const payload = {
      productType: 'MORTGAGE_CDT',
      documentTypeCedula: 'CC12345678',
      amount: 1000000,
      term: 12,
    };
    const error = new Error('boom');

    service.read.mockRejectedValue(error);

    await expect(controller.read(payload as never)).rejects.toThrow('boom');
  });
});
