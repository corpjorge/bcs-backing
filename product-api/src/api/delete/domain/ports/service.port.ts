import { DeleteModel } from '../models/delete.model';

export abstract class ServicePort {
  abstract delete(data: DeleteModel): Promise<{ message: string }>;
}
