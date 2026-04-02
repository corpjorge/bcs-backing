import { ProductModel } from '../models/registration.model';

export abstract class RepositoryPort {
  abstract create(data: ProductModel): Promise<{ message: string }>;
}
