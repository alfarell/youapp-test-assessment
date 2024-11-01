import { BaseDocument } from '@app/common';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class Account extends BaseDocument {
  @Prop({ type: SchemaTypes.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
