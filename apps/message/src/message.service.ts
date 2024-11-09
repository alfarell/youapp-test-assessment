import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Conversation, Message } from './schema';
import { Model, RootFilterQuery } from 'mongoose';
import {
  CLIENTS_NAME,
  FormatResponse,
  USER_PATTERNS,
  RmqService,
  MessageStatus,
  SendMessageDto,
  FormatRpcRequest,
  ConversatoinParams,
} from '@app/common';
import { ClientProxy, RmqContext } from '@nestjs/microservices';
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

  async viewMessage(payload: FormatRpcRequest) {
    const { accountId } = payload.params;

    const currentProfile = await this._getProfile(accountId);
    const messages = await this._findAndUpdateMessages({
      recipientId: currentProfile._id,
    });

    return new FormatResponse<Message[]>('Get messages success', messages);
  }

  async getConversations(payload: FormatRpcRequest) {
    const { accountId } = payload.params;

    const currentProfile = await this._getProfile(accountId);
    const conversations = await this.conversationModel.find({
      participant: {
        $in: [currentProfile._id],
      },
    });

    if (conversations.length === 0) {
      return new FormatResponse('Get conversations success', []);
    }

    const profileIds = conversations.reduce((acc, curr) => {
      return [
        ...acc,
        ...curr.participant.filter(
          (id) => id.toString() !== currentProfile._id,
        ),
      ];
    }, []);
    const recipientProfiles = await this._getProfiles(profileIds);
    const combinedWithProfile = conversations.map((conversation) => {
      const { _id, participant } = conversation;
      return {
        _id,
        participant: recipientProfiles
          .filter((recipient) => participant.includes(recipient._id))
          .concat(currentProfile),
      };
    });

    return new FormatResponse('Get conversations success', combinedWithProfile);
  }

  async getConversationById(
    payload: FormatRpcRequest<any, ConversatoinParams>,
  ) {
    const { conversationId, accountId } = payload.params;

    const currentProfile = await this._getProfile(accountId);
    const conversation = await this.conversationModel.findOne({
      _id: conversationId,
      participant: {
        $in: [currentProfile._id],
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    const profileIds = conversation.participant.map((id) => id.toString());
    const recipientProfile = await this._getProfiles(profileIds);
    const combinedWithProfile = {
      _id: conversation._id,
      participant: recipientProfile,
    };

    return new FormatResponse('Get conversation success', combinedWithProfile);
  }

  async sendMessage(
    payload: FormatRpcRequest<SendMessageDto>,
    context: RmqContext,
  ) {
    const { accountId } = payload.params;
    const { recipientId, content } = payload.data;

    const senderProfile = await this._getProfile(accountId);

    this._verifyInteractions(senderProfile._id, recipientId, context);

    const participant = [senderProfile._id, recipientId];
    const conversation = await this._findOneOrCreateConversation(
      {
        participant: {
          $all: participant,
        },
      },
      {
        participant,
      },
    );

    const createMessage = new this.messageModel({
      conversationId: conversation._id,
      senderId: senderProfile._id,
      recipientId,
      content,
    });
    const message = await createMessage.save();

    this.rmqService.ack(context);

    return new FormatResponse(`Message sent to ${message.recipientId}`);
  }

  private async _getProfile(accountId: string) {
    const payload = new FormatRpcRequest({ params: { accountId } });
    const getProfile = this.userClient.send(USER_PATTERNS.GET_PROFILE, payload);
    const profile = await lastValueFrom(getProfile);

    return profile.data;
  }

  private async _getProfiles(profileIds: string[]) {
    const payload = new FormatRpcRequest<any, { profileIds: string[] }>({
      params: { profileIds },
    });
    const getProfiles = this.userClient.send(
      USER_PATTERNS.GET_PROFILES,
      payload,
    );
    const profiles = await lastValueFrom(getProfiles);

    return profiles.data;
  }

  private async _findOneOrCreateConversation(
    condition: RootFilterQuery<Conversation>,
    doc,
  ) {
    const findConversation = await this.conversationModel.findOne(condition);

    if (findConversation) return findConversation;

    const createConversation = await this.conversationModel.create(doc);
    return createConversation;
  }

  private async _findAndUpdateMessages(
    condition: RootFilterQuery<Message>,
  ): Promise<Message[]> {
    const messages = await this.messageModel
      .find(condition)
      .sort({ createdAt: -1 })
      .limit(20);

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

    return messages;
  }

  private _verifyInteractions(
    senderId: string,
    recipientId: string,
    context: RmqContext,
  ) {
    if (senderId === recipientId) {
      this.rmqService.ack(context);
      throw new BadRequestException('Can not send message to own sender');
    }
  }
}
