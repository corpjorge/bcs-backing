import { ProductModel } from '../models/mulesoft.model';

export abstract class RepositoryPort {
  abstract get(data: ProductModel): Promise<{ message: string; data: any }>;
}
