import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReadController } from './infrastructure/controllers/read.controller';
import { ReadService } from './application/services/read.service';
import { ServicePort } from './domain/ports/service.port';
import { MongoRepository } from './infrastructure/repositories/mongo.repository';
import { RepositoryPort } from './domain/ports/repository.port';
import {
  Registration,
  RegistrationSchema,
} from '../registration/infrastructure/schemas/registration.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Registration.name, schema: RegistrationSchema },
    ]),
  ],
  controllers: [ReadController],
  providers: [
    { provide: ServicePort, useClass: ReadService },
    { provide: RepositoryPort, useClass: MongoRepository },
  ],
})
export class ReadModule {}
