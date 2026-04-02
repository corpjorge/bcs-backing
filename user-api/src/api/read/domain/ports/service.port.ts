import { ReadModel, ReadUserModel } from '../models/read.model';

export abstract class ServicePort {
  abstract read(data: ReadModel): Promise<ReadUserModel>;
}
