import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('/products/v1/')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Get('/products')
  async getProducts(
    @Query() query: Record<string, string | number | boolean>,
  ): Promise<unknown> {
    return await this.service.getProducts(query);
  }

  @Get('/read')
  async readProducts(
    @Query() query: Record<string, string | number | boolean>,
  ): Promise<unknown> {
    return await this.service.readProducts(query);
  }

  @Post('/registration')
  async createProduct(@Body() data: unknown): Promise<unknown> {
    return await this.service.createProduct(data);
  }
}

