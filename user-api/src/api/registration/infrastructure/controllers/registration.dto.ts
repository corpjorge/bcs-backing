import { IsIn, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import {
  DOCUMENT_TYPE_VALUES,
  DocumentType,
} from '../../domain/models/registration.model';

export class RegistrationDto {
  @IsIn(DOCUMENT_TYPE_VALUES)
  @IsNotEmpty()
  documentType: DocumentType;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  documentNumber: number;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
