import { Injectable } from '@nestjs/common';
import { ReadModel, ReadUserModel } from '../../domain/models/read.model';
import { RepositoryPort } from '../../domain/ports/repository.port';
import { ServicePort } from '../../domain/ports/service.port';

@Injectable()
export class ReadService implements ServicePort {
  constructor(private readonly repository: RepositoryPort) {}

  async create(data: ReadModel): Promise<ReadUserModel> {
    return await this.repository.create(data);
  }
}
