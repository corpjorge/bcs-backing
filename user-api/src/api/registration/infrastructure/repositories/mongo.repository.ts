import { ConflictException, Injectable } from '@nestjs/common';
import { logs } from '@opentelemetry/api-logs';
import { InjectModel } from '@nestjs/mongoose';
import { randomBytes, scryptSync } from 'crypto';
import { Model } from 'mongoose';
import { RegistrationModel } from '../../domain/models/registration.model';
import { RepositoryPort } from '../../domain/ports/repository.port';
import {
  Registration,
  RegistrationDocument,
} from '../schemas/registration.schema';

@Injectable()
export class MongoRepository implements RepositoryPort {
  private readonly logger = logs.getLogger('registration-repository');

  constructor(
    @InjectModel(Registration.name)
    private readonly registrationModel: Model<RegistrationDocument>,
  ) {}

  async create(data: RegistrationModel): Promise<{ message: string }> {
    try {
      await this.registrationModel.create({
        ...data,
        password: this.hashPassword(data.password),
      });
      this.logger.emit({
        severityText: 'INFO',
        body: 'usuario registrado',
        attributes: {
          documentType: data.documentType,
          documentNumber: data.documentNumber,
        },
      });
      return { message: 'ok' };
    } catch (error: unknown) {
      const duplicateField = this.getDuplicateField(error);

      if (duplicateField === 'documentNumber') {
        this.logger.emit({
          severityText: 'ERROR',
          body: 'usuario ya existe',
          attributes: {
            documentType: data.documentType,
            documentNumber: data.documentNumber,
          },
        });
        throw new ConflictException('documentNumber already exists');
      }

      throw error;
    }
  }

  private getDuplicateField(error: unknown): 'documentNumber' | null {
    if (!(error instanceof Error)) {
      return null;
    }

    const mongoError = error as Error & {
      code?: number;
      keyPattern?: Record<string, number>;
      keyValue?: Record<string, unknown>;
    };

    if (mongoError.code !== 11000) {
      return null;
    }

    if (
      mongoError.keyPattern?.documentNumber === 1 ||
      Object.prototype.hasOwnProperty.call(
        mongoError.keyValue ?? {},
        'documentNumber',
      )
    ) {
      return 'documentNumber';
    }
    return null;
  }

  private hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
  }
}
