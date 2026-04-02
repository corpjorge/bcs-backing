import { Injectable } from '@nestjs/common';
import { logs } from '@opentelemetry/api-logs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductModel } from '../../domain/models/registration.model';
import { RepositoryPort } from '../../domain/ports/repository.port';
import { Product, ProductDocument } from '../schemas/registration.schema';

@Injectable()
export class MongoRepository implements RepositoryPort {
  private readonly logger = logs.getLogger('product-repository');

  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async create(data: ProductModel): Promise<{ message: string }> {
    await this.productModel.create(data);
    this.logger.emit({
      severityText: 'INFO',
      body: 'product created',
      attributes: {
        productType: data.productType,
        user: data.user,
      },
    });

    return { message: 'ok' };
  }
}
