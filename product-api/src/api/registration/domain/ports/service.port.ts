import { ProductModel } from '../models/registration.model';

export abstract class ServicePort {
  abstract create(data: ProductModel): Promise<{ message: string }>;
}
