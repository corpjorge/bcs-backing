import { Injectable, UnauthorizedException } from '@nestjs/common';
import { logs } from '@opentelemetry/api-logs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { timingSafeEqual, scryptSync } from 'crypto';
import { ReadModel, ReadUserModel } from '../../domain/models/read.model';
import { RepositoryPort } from '../../domain/ports/repository.port';
import {
  Registration,
  RegistrationDocument,
} from '../../../registration/infrastructure/schemas/registration.schema';

@Injectable()
export class MongoRepository implements RepositoryPort {
  private readonly logger = logs.getLogger('read-repository');

  constructor(
    @InjectModel(Registration.name)
    private readonly registrationModel: Model<RegistrationDocument>,
  ) {}

  async read(data: ReadModel): Promise<ReadUserModel> {
    const registration = await this.registrationModel
      .findOne({
        documentType: data.documentType,
        documentNumber: data.documentNumber,
      })
      .exec();

    if (!registration) {
      this.logger.emit({
        severityText: 'ERROR',
        body: 'credenciales invalidas por usuario inexistente',
        attributes: {
          documentType: data.documentType,
          documentNumber: data.documentNumber,
        },
      });
      throw new UnauthorizedException('invalid credentials');
    }

    if (!this.isPasswordValid(data.password, registration.password)) {
      this.logger.emit({
        severityText: 'ERROR',
        body: 'contrasena incorrecta',
        attributes: {
          documentType: data.documentType,
          documentNumber: data.documentNumber,
        },
      });
      throw new UnauthorizedException('invalid credentials');
    }

    this.logger.emit({
      severityText: 'INFO',
      body: 'credenciales correctas',
      attributes: {
        documentType: data.documentType,
        documentNumber: data.documentNumber,
      },
    });

    return {
      documentType: registration.documentType,
      documentNumber: registration.documentNumber,
      username: registration.username,
    };
  }

  private isPasswordValid(password: string, storedPassword: string): boolean {
    const [salt, storedHash] = storedPassword.split(':');

    if (!salt || !storedHash) {
      return false;
    }

    const storedHashBuffer = Buffer.from(storedHash, 'hex');
    const derivedHash = scryptSync(password, salt, storedHashBuffer.length);

    return (
      storedHashBuffer.length === derivedHash.length &&
      timingSafeEqual(storedHashBuffer, derivedHash)
    );
  }
}
