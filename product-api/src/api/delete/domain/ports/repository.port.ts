import { DeleteModel } from '../models/delete.model';

export abstract class RepositoryPort {
  abstract delete(data: DeleteModel): Promise<{ message: string }>;
}
