import { RegistrationModel } from '../models/registration.model';

export abstract class ServicePort {
  abstract create(data: RegistrationModel): Promise<{ message: string }>;
}
