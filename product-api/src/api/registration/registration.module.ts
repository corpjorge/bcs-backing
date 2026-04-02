import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServicePort } from './domain/ports/service.port';
import { RepositoryPort } from './domain/ports/repository.port';
import { MetricsModule } from '../../commons/metrics.module';
import { RegistrationController } from './infrastructure/controllers/registration.controller';
import { MongoRepository } from './infrastructure/repositories/mongo.repository';
import { RegistrationService } from './application/services/registration.service';
import {
  Product,
  ProductSchema,
} from './infrastructure/schemas/registration.schema';

@Module({
  controllers: [RegistrationController],
  providers: [
    { provide: ServicePort, useClass: RegistrationService },
    { provide: RepositoryPort, useClass: MongoRepository },
  ],
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MetricsModule,
  ],
})
export class RegistrationModule {}
