import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReadController } from './infrastructure/controllers/read.controller';
import { ReadService } from './application/services/read.service';
import { ServicePort } from './domain/ports/service.port';
import { ProductRepository } from './infrastructure/repositories/mongo.repository';
import { RepositoryPort } from './domain/ports/repository.port';
import { Product, ProductSchema } from './infrastructure/schemas/read.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [ReadController],
  providers: [
    { provide: ServicePort, useClass: ReadService },
    { provide: RepositoryPort, useClass: ProductRepository },
  ],
})
export class ReadModule {}
