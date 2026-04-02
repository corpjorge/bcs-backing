import { Injectable } from '@nestjs/common';
import { logs } from '@opentelemetry/api-logs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductModel } from '../../domain/models/read.model';
import { RepositoryPort } from '../../domain/ports/repository.port';
import { Product, ProductDocument } from '../schemas/read.schema';

@Injectable()
export class ProductRepository implements RepositoryPort {
  private readonly logger = logs.getLogger('product-repository');

  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async read(data: ProductModel): Promise<{ message: string; data: any }> {
    const result = await this.productModel.findOne({
      user: data.user,
    });
    this.logger.emit({
      severityText: 'INFO',
      body: 'product searched',
      attributes: {
        user: data.user,
      },
    });

    return { message: 'ok', data: result };
  }
}
