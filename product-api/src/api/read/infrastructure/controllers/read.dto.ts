import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ProductModel } from '../../domain/models/read.model';


export class ProductDto implements ProductModel {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9]+$/, {
    message: 'documentType and cedula must be alphanumeric',
  })
  user: string;
}
