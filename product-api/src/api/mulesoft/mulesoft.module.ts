import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { MulesoftController } from './infrastructure/controllers/mulesoft.controller';
import { MulesoftService } from './application/services/mulesoft.service';
import { ServicePort } from './domain/ports/service.port';
import { MulesoftRepository } from './infrastructure/repositories/mulesoft.repository';
import { RepositoryPort } from './domain/ports/repository.port';
import { CachePort } from './domain/ports/cache.port';
import { RedisRepository } from './infrastructure/repositories/redis.repository';
import { REDIS_CLIENT } from './infrastructure/repositories/redis.tokens';

@Module({
  imports: [],
  controllers: [MulesoftController],
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('REDIS_HOST') ?? 'localhost';
        const port = Number(configService.get<string>('REDIS_PORT') ?? 6379);
        const db = Number(configService.get<string>('REDIS_DB') ?? 0);
        const password = configService.get<string>('REDIS_PASSWORD')?.trim();

        return new Redis({
          host,
          port,
          db,
          ...(password ? { password } : {}),
        });
      },
    },
    { provide: ServicePort, useClass: MulesoftService },
    { provide: RepositoryPort, useClass: MulesoftRepository },
    { provide: CachePort, useClass: RedisRepository },
  ],
})
export class MulesoftModule {}
