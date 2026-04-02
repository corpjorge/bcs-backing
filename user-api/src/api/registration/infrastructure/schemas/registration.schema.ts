import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { DocumentType } from '../../domain/models/registration.model';

export type RegistrationDocument = HydratedDocument<Registration>;

@Schema({ collection: 'registrations', timestamps: true })
export class Registration {
  @Prop({ required: true, enum: ['CC', 'CE', 'TI'], type: String })
  documentType: DocumentType;

  @Prop({ required: true, min: 1, unique: true, type: Number })
  documentNumber: number;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;
}

export const RegistrationSchema = SchemaFactory.createForClass(Registration);
