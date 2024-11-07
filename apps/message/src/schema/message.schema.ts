import { BaseDocument, MessageStatus } from '@app/common';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { Conversation } from './conversation.schema';

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
export class Message extends BaseDocument {
  @Prop({
    type: SchemaTypes.ObjectId,
    required: true,
    index: true,
    ref: Conversation.name,
  })
  conversationId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, required: true, index: true })
  senderId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, required: true, index: true })
  receiverId: Types.ObjectId;

  @Prop({ type: SchemaTypes.String, required: true })
  content: string;

  @Prop({
    type: SchemaTypes.String,
    enum: MessageStatus,
    default: MessageStatus.Sent,
  })
  status: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
