import { DocumentType } from '../../../registration/domain/models/registration.model';

export interface ReadModel {
  documentType: DocumentType;
  documentNumber: number;
  password: string;
}

export interface ReadUserModel {
  documentType: DocumentType;
  documentNumber: number;
  username: string;
}

