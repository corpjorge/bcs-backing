import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MetricsModule } from '../../commons/metrics.module';
import { DeleteService } from './application/services/delete.service';
import { ServicePort } from './domain/ports/service.port';
import { DeleteController } from './infrastructure/controllers/delete.controller';
import { MongoRepository } from './infrastructure/repositories/mongo.repository';
import { Product, ProductSchema } from './infrastructure/schemas/delete.schema';
import { RepositoryPort } from './domain/ports/repository.port';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MetricsModule,
  ],
  controllers: [DeleteController],
  providers: [
    { provide: ServicePort, useClass: DeleteService },
    { provide: RepositoryPort, useClass: MongoRepository },
  ],
})
export class DeleteModule {}
