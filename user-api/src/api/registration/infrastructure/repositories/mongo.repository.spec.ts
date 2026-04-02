import { randomBytes, scryptSync } from 'crypto';
import { MongoRepository } from './mongo.repository';

jest.mock('@opentelemetry/api-logs', () => ({
  logs: {
    getLogger: () => ({
      emit: jest.fn(),
    }),
  },
}));

jest.mock('crypto', () => {
  const actualCrypto = jest.requireActual('crypto');

  return {
    ...actualCrypto,
    randomBytes: jest.fn(() =>
      Buffer.from('00112233445566778899aabbccddeeff', 'hex'),
    ),
    scryptSync: jest.fn(() => Buffer.from('ab'.repeat(64), 'hex')),
  };
});

describe('MongoRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should hash password and create registration', async () => {
    const create = jest.fn().mockResolvedValue({ _id: '1' });
    const registrationModel = {
      create,
    } as never;

    const repository = new MongoRepository(registrationModel);
    const payload = {
      documentType: 'CC',
      documentNumber: 12345678,
      username: 'jorge',
      password: 'test4',
    };

    await expect(repository.create(payload as never)).resolves.toEqual({
      message: 'ok',
    });
    expect(randomBytes).toHaveBeenCalledWith(16);
    expect(scryptSync).toHaveBeenCalledWith(
      'test4',
      '00112233445566778899aabbccddeeff',
      64,
    );
    expect(create).toHaveBeenCalledWith({
      ...payload,
      password:
        '00112233445566778899aabbccddeeff:' + 'ab'.repeat(64),
    });
  });

  it('should throw conflict when documentNumber already exists', async () => {
    const conflictError = new Error('duplicate key') as Error & {
      code?: number;
      keyPattern?: Record<string, number>;
    };
    conflictError.code = 11000;
    conflictError.keyPattern = { documentNumber: 1 };

    const create = jest.fn().mockRejectedValue(conflictError);
    const registrationModel = {
      create,
    } as never;

    const repository = new MongoRepository(registrationModel);

    await expect(
      repository.create({
        documentType: 'CC',
        documentNumber: 12345678,
        username: 'jorge',
        password: 'test4',
      } as never),
    ).rejects.toMatchObject({
      response: {
        message: 'documentNumber already exists',
        error: 'Conflict',
        statusCode: 409,
      },
    });
  });

  it('should rethrow unexpected errors', async () => {
    const error = new Error('boom');
    const create = jest.fn().mockRejectedValue(error);
    const registrationModel = {
      create,
    } as never;

    const repository = new MongoRepository(registrationModel);

    await expect(
      repository.create({
        documentType: 'CC',
        documentNumber: 12345678,
        username: 'jorge',
        password: 'test4',
      } as never),
    ).rejects.toThrow('boom');
  });
});

