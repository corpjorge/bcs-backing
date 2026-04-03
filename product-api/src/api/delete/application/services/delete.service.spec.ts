import { DeleteService } from './delete.service';
import { RepositoryPort } from '../../domain/ports/repository.port';

describe('DeleteService', () => {
  let service: DeleteService;
  let repository: jest.Mocked<RepositoryPort>;

  beforeEach(() => {
    repository = {
      delete: jest.fn().mockResolvedValue({ message: 'ok' }),
    };

    service = new DeleteService(repository);
  });

  it('delegates deletion to repository', async () => {
    await expect(
      service.delete({ id: '69cf4bd0ef8d4a8389765126' }),
    ).resolves.toEqual({ message: 'ok' });

    expect(repository.delete).toHaveBeenCalledWith({
      id: '69cf4bd0ef8d4a8389765126',
    });
  });
});
