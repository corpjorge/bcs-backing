import { ProductModel } from '../models/mulesoft.model';

export abstract class CachePort {
  abstract get(data: ProductModel): Promise<{ message: string; data: any }>;
  abstract set(
    data: ProductModel,
    products: any[],
  ): Promise<{ message: string; data: any }>;
}
