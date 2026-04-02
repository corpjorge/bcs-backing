import { RegistrationModel } from '../models/registration.model';

export abstract class RepositoryPort {
  abstract create(data: RegistrationModel): Promise<{ message: string }>;
}
