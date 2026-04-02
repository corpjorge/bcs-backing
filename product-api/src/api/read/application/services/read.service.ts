import { Injectable } from '@nestjs/common';
import { ProductModel } from '../../domain/models/read.model';
import { RepositoryPort } from '../../domain/ports/repository.port';
import { ServicePort } from '../../domain/ports/service.port';

@Injectable()
export class ReadService implements ServicePort {
  constructor(private readonly repository: RepositoryPort) {}

  async read(data: ProductModel) {
    return await this.repository.read(data);
  }
}
