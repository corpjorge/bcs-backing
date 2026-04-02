import { IsIn, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { DOCUMENT_TYPE_VALUES, DocumentType } from '../../../registration/domain/models/registration.model';
import { ReadModel } from '../../domain/models/read.model';

export class ReadDto implements ReadModel {
  @IsIn(DOCUMENT_TYPE_VALUES)
  @IsNotEmpty()
  documentType: DocumentType;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  documentNumber: number;

  @IsString()
  @IsNotEmpty()
  password: string;
}
