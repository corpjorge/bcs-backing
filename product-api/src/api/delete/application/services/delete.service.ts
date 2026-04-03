import { Injectable } from '@nestjs/common';
import { DeleteModel } from '../../domain/models/delete.model';
import { RepositoryPort } from '../../domain/ports/repository.port';
import { ServicePort } from '../../domain/ports/service.port';

@Injectable()
export class DeleteService implements ServicePort {
  constructor(private readonly repository: RepositoryPort) {}

  async delete(data: DeleteModel): Promise<{ message: string }> {
    return await this.repository.delete(data);
  }
}
