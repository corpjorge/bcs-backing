import { UnauthorizedException } from '@nestjs/common';
import { randomBytes, scryptSync } from 'crypto';
import { MongoRepository } from './mongo.repository';

describe('MongoRepository', () => {
  const buildPassword = (password: string): string => {
    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
  };

  it('should return ok when password matches', async () => {
    const registrationModel = {
      findOne: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          documentType: 'CC',
          documentNumber: 12345678,
          username: 'test',
          password: buildPassword('1234'),
        }),
      }),
    } as never;

    const repository = new MongoRepository(registrationModel);

    await expect(
      repository.create({
        documentType: 'CC',
        documentNumber: 12345678,
        password: '1234',
      } as never),
    ).resolves.toEqual({
      documentType: 'CC',
      documentNumber: 12345678,
      username: 'test',
    });
  });

  it('should throw 401 when password is invalid', async () => {
    const registrationModel = {
      findOne: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          password: buildPassword('abcd'),
        }),
      }),
    } as never;

    const repository = new MongoRepository(registrationModel);

    await expect(
      repository.create({
        documentType: 'CC',
        documentNumber: 12345678,
        password: '1234',
      } as never),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
