import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RegistrationController } from './infrastructure/controllers/registration.controller';
import { RegistrationService } from './application/services/registration.service';
import { ServicePort } from './domain/ports/service.port';
import { MongoRepository } from './infrastructure/repositories/mongo.repository';
import { RepositoryPort } from './domain/ports/repository.port';
import {
  Registration,
  RegistrationSchema,
} from './infrastructure/schemas/registration.schema';
import { MetricsModule } from '../../commons/metrics.module';

@Module({
  controllers: [RegistrationController],
  providers: [
    { provide: ServicePort, useClass: RegistrationService },
    { provide: RepositoryPort, useClass: MongoRepository },
  ],
  imports: [
    MongooseModule.forFeature([
      { name: Registration.name, schema: RegistrationSchema },
    ]),
    MetricsModule,
  ],
})
export class RegistrationModule {}
