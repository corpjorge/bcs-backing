import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  PRODUCT_TYPE_VALUES,
  ProductType,
} from '../../domain/models/registration.model';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ collection: 'products', timestamps: true })
export class Product {
  @Prop({ required: true, enum: PRODUCT_TYPE_VALUES, type: String })
  productType: ProductType;

  @Prop({ required: true, type: String })
  user: string;

  @Prop({ required: true, min: 1, type: Number })
  amount: number;

  @Prop({ required: true, min: 1, type: Number })
  term: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
