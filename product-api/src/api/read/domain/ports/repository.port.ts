import { ProductModel } from '../models/read.model';

export abstract class RepositoryPort {
  abstract read(data: ProductModel): Promise<{ message: string; data: any }>;
}
