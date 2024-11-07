import { BaseDocument } from '@app/common';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@Schema({
  versionKey: false,
  timestamps: true,
  autoIndex: true,
  toJSON: {
    transform: function (doc, ret) {
      delete ret.createdAt;
      delete ret.updatedAt;
      return ret;
    },
  },
})
export class Conversation extends BaseDocument {
  @Prop({
    type: [SchemaTypes.ObjectId],
    required: true,
    index: true,
  })
  participant: Types.ObjectId[];
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
