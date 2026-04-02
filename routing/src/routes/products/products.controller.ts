import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { MetricsService } from '../../commons/metrics.service';

@Controller('/products/v1/')
export class ProductsController {
  constructor(
    private readonly service: ProductsService,
    private readonly metricsService: MetricsService,
  ) {}

  @Get('/products')
  async getProducts(
    @Query() query: Record<string, string | number | boolean>,
  ): Promise<unknown> {
    this.metricsService.increment('controller.metric');
    return await this.service.getProducts(query);
  }

  @Get('/read')
  async readProducts(
    @Query() query: Record<string, string | number | boolean>,
  ): Promise<unknown> {
    this.metricsService.increment('controller.metric');
    return await this.service.readProducts(query);
  }

  @Post('/registration')
  async createProduct(@Body() data: unknown): Promise<unknown> {
    this.metricsService.increment('controller.metric');
    return await this.service.createProduct(data);
  }
}

