import { Injectable, NotFoundException } from '@nestjs/common';
import { logs } from '@opentelemetry/api-logs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeleteModel } from '../../domain/models/delete.model';
import { RepositoryPort } from '../../domain/ports/repository.port';
import { Product, ProductDocument } from '../schemas/delete.schema';

@Injectable()
export class MongoRepository implements RepositoryPort {
  private readonly logger = logs.getLogger('product-repository');

  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async delete(data: DeleteModel): Promise<{ message: string }> {
    const deletedProduct = await this.productModel.findByIdAndDelete(data.id).exec();

    if (!deletedProduct) {
      throw new NotFoundException(`Product with id ${data.id} not found`);
    }

    this.logger.emit({
      severityText: 'INFO',
      body: 'product deleted',
      attributes: {
        productId: data.id,
      },
    });

    return { message: 'ok' };
  }
}
