import { ProductModel } from '../models/mulesoft.model';

export abstract class ServicePort {
  abstract get(data: ProductModel): Promise<{ message: string; data: any }>;
}
