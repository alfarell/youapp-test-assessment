import { Test, TestingModule } from '@nestjs/testing';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import {
  BadRequestException,
  NotFoundException,
  ValidationPipe,
} from '@nestjs/common';
import {
  CLIENTS_NAME,
  CustomRpcExceptionFilter,
  FormatResponse,
  FormatRpcRequest,
  MongoExceptionFilter,
  RmqService,
  SendMessageDto,
} from '@app/common';
import { getModelToken } from '@nestjs/mongoose';
import { Conversation, Message } from './schema';
import { Model, Query, Types } from 'mongoose';
import { MockClientProxy } from '@app/test';
import * as rxjs from 'rxjs';
import { RmqContext } from '@nestjs/microservices';

const mockMessage = {
  _id: new Types.ObjectId('672f6db955126c5415a37c44'),
  conversationId: new Types.ObjectId('672f6db955126c5415b37c44'),
  senderId: new Types.ObjectId('6731a14c9b7695bc95beca66'),
  recipientId: new Types.ObjectId('6730e3a58a36057cb3b4bd43'),
  content: 'hello',
  status: 'sent',
};
const mockConversation = {
  _id: new Types.ObjectId('672f6db955126c5415b37c44'),
  participant: [
    new Types.ObjectId('6731a14c9b7695bc95beca66'),
    new Types.ObjectId('6730e3a58a36057cb3b4bd43'),
  ],
};
const mockProfile = {
  _id: new Types.ObjectId('6731a14c9b7695bc95beca66'),
  accountId: 'abc-123',
  name: 'Test 1',
  gender: 'male',
  birthday: '2000-11-02T13:22:59.416Z',
  height: 160,
  weight: 64,
  horoscope: 'Scorpius',
  zodiac: 'Scorpion',
};

const GetMessagesInstance = FormatResponse<Message[]>;

type RmqContextArgs = [Record<string, any>, any, string];
class RmqContextMock extends RmqContext {
  constructor(args: RmqContextArgs) {
    super(args);
  }
  getChannelRef() {
    return {
      ack: jest.fn(),
    };
  }
  getMessage() {
    return {};
  }
  getPattern() {
    return '';
  }
  getArgs() {
    return [{}, null, ''] as RmqContextArgs;
  }
  getArgByIndex() {}
}

describe('MessageController', () => {
  let messageController: MessageController;
  let messageModel: Model<Message>;
  let conversationModel: Model<Conversation>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MessageController],
      providers: [
        MessageService,
        RmqService,
        {
          provide: CLIENTS_NAME.USER_SERVICE,
          useValue: MockClientProxy,
        },
        { provide: APP_FILTER, useClass: CustomRpcExceptionFilter },
        { provide: APP_FILTER, useClass: MongoExceptionFilter },
        {
          provide: APP_PIPE,
          useValue: ValidationPipe,
        },
        {
          provide: getModelToken(Message.name),
          useValue: Model,
        },
        {
          provide: getModelToken(Conversation.name),
          useValue: Model,
        },
      ],
    }).compile();

    messageController = await app.resolve<MessageController>(MessageController);
    messageModel = app.get<Model<Message>>(getModelToken(Message.name));
    conversationModel = app.get<Model<Conversation>>(
      getModelToken(Conversation.name),
    );
  });

  describe('view message', () => {
    it('should return messages data', async () => {
      const payload = new FormatRpcRequest({
        params: {
          accountId: 'abc-123',
        },
      });
      const profileRes = mockProfile;
      const mockRes = [mockMessage];

      jest.spyOn(MockClientProxy, 'send').mockReturnValueOnce(profileRes);
      jest.spyOn(rxjs, 'lastValueFrom').mockResolvedValue({ data: profileRes });
      jest.spyOn(messageModel, 'find').mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue(mockRes),
        }),
      } as unknown as Query<Message[], any>);
      jest
        .spyOn(messageModel, 'updateMany')
        .mockImplementation(
          jest.fn().mockResolvedValue([{ ...mockMessage, status: 'read' }]),
        );

      const req = await messageController.viewMessage(payload);

      expect(req).toBeInstanceOf(GetMessagesInstance);
      expect(req.data).toEqual(mockRes);
      expect(req.message).toEqual('Get messages success');
    });
  });

  describe('get conversations', () => {
    it('should return conversations data', async () => {
      const payload = new FormatRpcRequest({
        params: {
          accountId: 'abc-123',
        },
      });
      const profileRes = mockProfile;
      const mockRes = [mockConversation];

      jest.spyOn(MockClientProxy, 'send').mockReturnValue(profileRes);
      jest
        .spyOn(rxjs, 'lastValueFrom')
        .mockResolvedValue({ data: [profileRes] });
      jest
        .spyOn(conversationModel, 'find')
        .mockImplementation(jest.fn().mockResolvedValue(mockRes));

      const req = await messageController.getConversations(payload);

      expect(req).toBeInstanceOf(GetMessagesInstance);
      expect(req.data).toHaveLength(mockRes.length);
      expect(req.message).toEqual('Get conversations success');
    });

    it('should return empty array when no conversations found', async () => {
      const payload = new FormatRpcRequest({
        params: {
          accountId: 'abc-123',
        },
      });
      const profileRes = mockProfile;
      const mockRes = [];

      jest.spyOn(MockClientProxy, 'send').mockReturnValue(profileRes);
      jest
        .spyOn(rxjs, 'lastValueFrom')
        .mockResolvedValue({ data: [profileRes] });
      jest
        .spyOn(conversationModel, 'find')
        .mockImplementation(jest.fn().mockResolvedValue(mockRes));

      const req = await messageController.getConversations(payload);

      expect(req).toBeInstanceOf(GetMessagesInstance);
      expect(req.data).toHaveLength(0);
      expect(req.message).toEqual('Get conversations success');
    });
  });

  describe('get conversation by id', () => {
    it('should return conversation data base on requested id', async () => {
      const payload = new FormatRpcRequest({
        params: {
          accountId: 'abc-123',
          conversationId: mockConversation._id.toString(),
        },
      });
      const profileRes = mockProfile;
      const mockRes = mockConversation;

      jest.spyOn(MockClientProxy, 'send').mockReturnValue(profileRes);
      jest
        .spyOn(rxjs, 'lastValueFrom')
        .mockResolvedValue({ data: [profileRes] });
      jest
        .spyOn(conversationModel, 'findOne')
        .mockImplementation(jest.fn().mockResolvedValue(mockRes));
      jest.spyOn(messageModel, 'find').mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue([mockMessage]),
        }),
      } as unknown as Query<Message[], any>);

      const req = await messageController.getConversationById(payload);

      expect(req).toBeInstanceOf(GetMessagesInstance);
      expect(req.data._id.toString()).toEqual(payload.params.conversationId);
      expect(req.message).toEqual('Get conversation success');
    });

    it('should throw error when conversation is not found', async () => {
      const payload = new FormatRpcRequest({
        params: {
          accountId: 'abc-123',
          conversationId: '672f6db955126c5415b37c44',
        },
      });
      const profileRes = mockProfile;

      jest.spyOn(MockClientProxy, 'send').mockReturnValue(profileRes);
      jest
        .spyOn(rxjs, 'lastValueFrom')
        .mockResolvedValue({ data: [profileRes] });
      jest
        .spyOn(conversationModel, 'findOne')
        .mockImplementation(jest.fn().mockResolvedValue(null));

      try {
        await messageController.getConversationById(payload);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toEqual('Conversation not found');
      }
    });
  });

  describe('send message', () => {
    it('should return success when send message is success', async () => {
      const payload = new FormatRpcRequest<SendMessageDto>({
        params: {
          accountId: 'abc-123',
        },
        data: {
          recipientId: '6730e3a58a36057cb3b4bd43',
          content: 'hello',
        },
      });
      const profileRes = mockProfile;

      jest.spyOn(MockClientProxy, 'send').mockReturnValue(profileRes);
      jest.spyOn(rxjs, 'lastValueFrom').mockResolvedValue({ data: profileRes });
      jest
        .spyOn(conversationModel, 'findOne')
        .mockImplementation(jest.fn().mockResolvedValue(mockConversation));
      jest
        .spyOn(messageModel, 'create')
        .mockImplementation(jest.fn().mockReturnValue(mockMessage));

      const req = await messageController.sendMessage(
        payload,
        new RmqContextMock([{}, null, '']),
      );

      expect(req).toBeInstanceOf(FormatResponse);
      expect(req.message).toEqual(
        `Message sent to ${payload.data.recipientId}`,
      );
    });

    it('should throw error when recipient id is same as sender id', async () => {
      const payload = new FormatRpcRequest<SendMessageDto>({
        params: {
          accountId: 'abc-123',
        },
        data: {
          recipientId: mockProfile._id.toString(),
          content: 'hello',
        },
      });
      const profileRes = mockProfile;

      jest.spyOn(MockClientProxy, 'send').mockReturnValue(profileRes);
      jest
        .spyOn(rxjs, 'lastValueFrom')
        .mockResolvedValue({ data: [profileRes] });
      jest
        .spyOn(conversationModel, 'findOne')
        .mockImplementation(jest.fn().mockResolvedValue(null));

      try {
        await messageController.sendMessage(
          payload,
          new RmqContextMock([{}, null, '']),
        );
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toEqual('Can not send message to own sender');
      }
    });
  });
});
