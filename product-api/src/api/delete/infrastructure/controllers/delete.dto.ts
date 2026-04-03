import { IsMongoId } from 'class-validator';
import { DeleteModel } from '../../domain/models/delete.model';

export class DeleteDto implements DeleteModel {
  @IsMongoId()
  id: string;
}
