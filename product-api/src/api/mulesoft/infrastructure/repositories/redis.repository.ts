import { Inject, Injectable } from '@nestjs/common';
import { logs } from '@opentelemetry/api-logs';
import Redis from 'ioredis';
import { ProductModel } from '../../domain/models/mulesoft.model';
import { CachePort } from '../../domain/ports/cache.port';
import { REDIS_CLIENT } from './redis.tokens';

@Injectable()
export class RedisRepository implements CachePort {
  private readonly logger = logs.getLogger('mulesoft-cache-repository');

  constructor(@Inject(REDIS_CLIENT) private readonly redisClient: Redis) {}

  async get(data: ProductModel): Promise<{ message: string; data: any }> {
    const key = `mulesoft:products:${data.user}`;
    const rawValue = await this.redisClient.get(key);
    const cachedProducts = rawValue ? (JSON.parse(rawValue) as any[]) : [];

    this.logger.emit({
      severityText: 'INFO',
      body: cachedProducts.length > 0 ? 'cache hit' : 'cache miss',
      attributes: { user: data.user, items: cachedProducts.length },
    });

    return { message: 'ok', data: cachedProducts };
  }

  async set(
    data: ProductModel,
    products: any[],
  ): Promise<{ message: string; data: any }> {
    const key = `mulesoft:products:${data.user}`;
    await this.redisClient.set(key, JSON.stringify(products));

    this.logger.emit({
      severityText: 'INFO',
      body: 'cache set',
      attributes: { user: data.user, items: products.length },
    });

    return { message: 'ok', data: products };
  }
}
