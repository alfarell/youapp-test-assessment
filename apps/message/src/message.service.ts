import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Conversation, Message } from './schema';
import { Model, RootFilterQuery } from 'mongoose';
import {
  CLIENTS_NAME,
  FormatResponse,
  USER_PATTERNS,
  CreateMessageDto,
  RmqService,
  MessageStatus,
} from '@app/common';
import { ClientProxy, RmqContext, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
    @Inject(CLIENTS_NAME.USER_SERVICE) private userClient: ClientProxy,
    @Inject() private rmqService: RmqService,
  ) {}

  async viewMessage(accountId: string) {
    try {
      const profile = await this._getSenderProfile(accountId);
      const messages = await this.messageModel
        .find({
          receiverId: profile._id,
        })
        .sort({ createdAt: -1 })
        .limit(20);

      if (messages.length > 0) {
        const filterSentMsg = messages
          .filter(
            (message) =>
              message.status === MessageStatus.Sent ||
              message.status === MessageStatus.Delivered,
          )
          .map((message) => {
            message.status = MessageStatus.Read;
            return message._id;
          });

        await this.messageModel.updateMany(
          {
            _id: {
              $in: filterSentMsg,
            },
          },
          { status: MessageStatus.Read },
        );
      }

      return new FormatResponse<Message[]>('Get message success', messages);
    } catch (err) {
      throw new RpcException(new InternalServerErrorException(err));
    }
  }

  async sendMessage(payload: CreateMessageDto, context: RmqContext) {
    try {
      const { receiverId, content } = payload.data;
      const senderProfile = await this._getSenderProfile(payload.accountId);

      this._verifyInteractions(senderProfile._id, receiverId);

      const participant = [senderProfile._id, receiverId];
      const conversation = await this._findOneOrCreate(
        {
          participant: {
            $in: participant,
          },
        },
        {
          participant,
        },
      );

      const createMessage = new this.messageModel({
        conversationId: conversation._id,
        senderId: senderProfile._id,
        receiverId,
        content,
      });
      const message = await createMessage.save();

      this.rmqService.ack(context);

      return new FormatResponse(`Message sent to ${message.receiverId}`);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === 'same-sender') {
          this.rmqService.ack(context);
          throw new RpcException(
            new BadRequestException('Can not send message to own sender'),
          );
        }
      }

      throw new RpcException(new InternalServerErrorException(err));
    }
  }

  async _getSenderProfile(accountId: string) {
    const getProfile = this.userClient.send(
      USER_PATTERNS.GET_PROFILE,
      accountId,
    );
    const profile = await lastValueFrom(getProfile);

    return profile.data;
  }

  async _findOneOrCreate(condition: RootFilterQuery<Conversation>, doc) {
    const find = await this.conversationModel.findOne(condition);

    if (find) return find;

    const create = await this.conversationModel.create(doc);
    return create;
  }

  _verifyInteractions(senderId: string, receiverId: string) {
    if (senderId === receiverId) {
      throw new Error('same-sender');
    }
  }
}
