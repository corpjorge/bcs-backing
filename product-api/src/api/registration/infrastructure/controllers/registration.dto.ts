import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  Min,
} from 'class-validator';
import {
  PRODUCT_TYPE_VALUES,
  ProductModel,
  ProductType,
} from '../../domain/models/registration.model';

export class ProductDto implements ProductModel {
  @IsIn(PRODUCT_TYPE_VALUES)
  @IsNotEmpty()
  productType: ProductType;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9]+$/, {
    message: 'documentType and cedula must be alphanumeric',
  })
  user: string;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  amount: number;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  term: number;
}
