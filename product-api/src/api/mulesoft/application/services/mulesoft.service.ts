import { Injectable } from '@nestjs/common';
import { ProductModel } from '../../domain/models/mulesoft.model';
import { CachePort } from '../../domain/ports/cache.port';
import { RepositoryPort } from '../../domain/ports/repository.port';
import { ServicePort } from '../../domain/ports/service.port';

@Injectable()
export class MulesoftService implements ServicePort {
  constructor(
    private readonly cache: CachePort,
    private readonly repository: RepositoryPort,
  ) {}

  async get(data: ProductModel) {
    const cached = await this.cache.get(data);

    if (Array.isArray(cached.data) && cached.data.length > 0) {
      return cached;
    }

    const sourceResponse = await this.repository.get(data);
    const products = Array.isArray(sourceResponse.data)
      ? sourceResponse.data
      : sourceResponse.data
        ? [sourceResponse.data]
        : [];

    await this.cache.set(data, products);

    return { message: 'ok', data: products };
  }
}
