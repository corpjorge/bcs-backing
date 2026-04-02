export enum DocumentType {
  CC = 'CC',
  CE = 'CE',
  TI = 'TI',
}

export const DOCUMENT_TYPE_VALUES: ReadonlyArray<DocumentType> = [
  DocumentType.CC,
  DocumentType.CE,
  DocumentType.TI,
];

export interface RegistrationModel {
  documentType: DocumentType;
  documentNumber: number;
  username: string;
  password: string;
}
