import { Schema, Prop } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class BaseDocument extends Document {
  @Prop({ type: SchemaTypes.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ type: SchemaTypes.Date })
  createdAt: string;

  @Prop({ type: SchemaTypes.Date })
  updatedAt: string;
}
