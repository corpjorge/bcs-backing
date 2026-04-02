import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { MetricsModule } from '../../commons/metrics.module';

@Module({
  imports: [HttpModule, MetricsModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}

