import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ReadDocument = HydratedDocument<Read>;

@Schema({ collection: 'reads', timestamps: true })
export class Read {
  @Prop({ required: true, trim: true })
  name: string;
}

export const ReadSchema = SchemaFactory.createForClass(Read);
