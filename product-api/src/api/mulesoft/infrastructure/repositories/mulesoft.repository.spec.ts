import {
  BadGatewayException,
  InternalServerErrorException,
} from '@nestjs/common';
import { MulesoftRepository } from './mulesoft.repository';

jest.mock('@opentelemetry/api-logs', () => ({
  logs: {
    getLogger: () => ({
      emit: jest.fn(),
    }),
  },
}));

describe('MulesoftRepository', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should call mulesoft with user query param and return data', async () => {
    const configService = {
      get: jest
        .fn()
        .mockReturnValue(
          'https://4fed5556-f8bc-48ba-990d-36d088ecf9ff.mock.pstmn.io/v1/core',
        ),
    };

    const responseData = { product: 'ok' };

    const fetchSpy = jest.spyOn(global, 'fetch' as never).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(responseData),
    } as never);

    const repository = new MulesoftRepository(configService as never);

    await expect(repository.get({ user: 'CC12345' })).resolves.toEqual({
      message: 'ok',
      data: responseData,
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://4fed5556-f8bc-48ba-990d-36d088ecf9ff.mock.pstmn.io/v1/core?user=CC12345',
      { method: 'GET' },
    );
  });

  it('should throw when env url is missing', async () => {
    const configService = {
      get: jest.fn().mockReturnValue(undefined),
    };

    const repository = new MulesoftRepository(configService as never);

    await expect(repository.get({ user: 'CC12345' })).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('should throw BadGatewayException when mulesoft fails', async () => {
    const configService = {
      get: jest
        .fn()
        .mockReturnValue(
          'https://4fed5556-f8bc-48ba-990d-36d088ecf9ff.mock.pstmn.io/v1/core',
        ),
    };

    jest.spyOn(global, 'fetch' as never).mockResolvedValue({
      ok: false,
      status: 500,
      json: jest.fn(),
    } as never);

    const repository = new MulesoftRepository(configService as never);

    await expect(repository.get({ user: 'CC12345' })).rejects.toThrow(
      BadGatewayException,
    );
  });
});
