import { ReadModel, ReadUserModel } from '../models/read.model';

export abstract class RepositoryPort {
  abstract read(data: ReadModel): Promise<ReadUserModel>;
}
