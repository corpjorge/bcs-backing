import { ReadModel, ReadUserModel } from '../models/read.model';

export abstract class RepositoryPort {
  abstract create(data: ReadModel): Promise<ReadUserModel>;
}
