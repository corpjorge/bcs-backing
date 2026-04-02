import { Injectable } from '@nestjs/common';
import { RegistrationModel } from '../../domain/models/registration.model';
import { RepositoryPort } from '../../domain/ports/repository.port';
import { ServicePort } from '../../domain/ports/service.port';

@Injectable()
export class RegistrationService implements ServicePort {
  constructor(private readonly repository: RepositoryPort) {}

  async create(data: RegistrationModel): Promise<{ message: string }> {
    return await this.repository.create(data);
  }
}
