import { BaseDocument } from '@app/common';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Account } from './auth-account.schema';

@Schema({ versionKey: false, timestamps: true })
export class Session extends BaseDocument {
  @Prop({
    type: SchemaTypes.ObjectId,
    required: true,
    unique: false,
    ref: 'Account',
  })
  accountId: Account;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
