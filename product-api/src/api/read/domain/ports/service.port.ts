import { ProductModel } from '../models/read.model';

export abstract class ServicePort {
  abstract read(data: ProductModel): Promise<{ message: string; data: any }>;
}
