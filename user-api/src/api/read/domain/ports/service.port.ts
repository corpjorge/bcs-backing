import { ReadModel, ReadUserModel } from '../models/read.model';

export abstract class ServicePort {
  abstract create(data: ReadModel): Promise<ReadUserModel>;
}
