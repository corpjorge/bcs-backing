import { Module } from '@nestjs/common';
import { RegistrationModule } from './api/registration/registration.module';
import { ReadModule } from './api/read/read.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MetricsModule } from './commons/metrics.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const legacyUri = configService.get<string>('MONGOSTRING');

        if (legacyUri) {
          return {
            uri: legacyUri,
            dbName: configService.get<string>('MONGO_DB_NAME') ?? 'user-api',
          };
        }

        const host = configService.getOrThrow<string>('MONGO_HOST');
        const port = configService.getOrThrow<string>('MONGO_PORT');
        const username = configService.getOrThrow<string>('MONGO_USER');
        const password = configService.getOrThrow<string>('MONGO_PASSWORD');
        const dbName = configService.get<string>('MONGO_DB_NAME') ?? 'user-api';
        const authSource =
          configService.get<string>('MONGO_AUTH_SOURCE') ?? 'admin';

        return {
          uri: `mongodb://${username}:${password}@${host}:${port}/${dbName}?authSource=${authSource}`,
          dbName,
        };
      },
    }),
    MetricsModule,
    RegistrationModule,
    ReadModule,
  ],
})
export class AppModule {}
