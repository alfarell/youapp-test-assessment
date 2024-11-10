import { Test, TestingModule } from '@nestjs/testing';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import {
  CLIENTS_NAME,
  ConversatoinParams,
  FormatRpcRequest,
  MESSAGE_PATTERNS,
  SendMessageDto,
} from '@app/common';
import { MockClientProxy, MockRequest } from '@app/test';
import { APP_PIPE, REQUEST } from '@nestjs/core';
import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';

const mockHeaders = { accountId: 'account-id-123' };

describe('MessageController', () => {
  let controller: MessageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageController],
      providers: [
        MessageService,
        {
          provide: CLIENTS_NAME.MESSAGE_SEND_RMQ_SERVICE,
          useValue: MockClientProxy,
        },
        {
          provide: CLIENTS_NAME.MESSAGE_VIEW_RMQ_SERVICE,
          useValue: MockClientProxy,
        },
        {
          provide: REQUEST,
          useValue: new MockRequest<{ accountId: string }>({
            headers: mockHeaders,
          }),
        },
        {
          provide: APP_PIPE,
          useClass: ValidationPipe,
        },
      ],
    }).compile();

    controller = await module.resolve<MessageController>(MessageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return messages data', () => {
    const mockPayload = new FormatRpcRequest({
      params: mockHeaders,
    });
    const mockRes = [
      {
        id: 'message-123',
        content: 'hello',
      },
    ];
    const mockFn = jest
      .spyOn(MockClientProxy, 'send')
      .mockReturnValueOnce(mockRes);
    const res = controller.viewMessages();

    expect(mockFn).toHaveBeenCalledWith(MESSAGE_PATTERNS.VIEW, mockPayload);
    expect(res).toHaveLength(mockRes.length);
    expect(res).toEqual(mockRes);
  });

  it('should return conversations data', () => {
    const mockPayload = new FormatRpcRequest({
      params: mockHeaders,
    });
    const mockRes = [
      {
        id: 'conv-123',
        participant: ['user-123', 'user-456'],
      },
    ];
    const mockFn = jest
      .spyOn(MockClientProxy, 'send')
      .mockReturnValueOnce(mockRes);
    const res = controller.getConversations();

    expect(mockFn).toHaveBeenCalledWith(
      MESSAGE_PATTERNS.CONVERSATIONS,
      mockPayload,
    );
    expect(res).toHaveLength(mockRes.length);
    expect(res).toEqual(mockRes);
  });

  it('should return conversation data by id', () => {
    const conversationId = 'conv-123';
    const mockPayload = new FormatRpcRequest<any, ConversatoinParams>({
      params: { ...mockHeaders, conversationId },
    });
    const mockRes = {
      id: conversationId,
      participant: ['user-123', 'user-456'],
    };
    const mockFn = jest
      .spyOn(MockClientProxy, 'send')
      .mockReturnValueOnce(mockRes);
    const res = controller.getConversationById(conversationId);

    expect(mockFn).toHaveBeenCalledWith(
      MESSAGE_PATTERNS.CONVERSATION_ID,
      mockPayload,
    );
    expect(res).toEqual(mockRes);
    expect(res).toHaveProperty('id');
    expect(res).toHaveProperty('participant');
  });

  it('should return success response on send message', () => {
    const mockMessage = {
      recipientId: 'user-123',
      content: 'hello',
    };
    const mockPayload = new FormatRpcRequest<SendMessageDto>({
      params: mockHeaders,
      data: mockMessage,
    });
    const mockRes = `message sent to user ${mockMessage.recipientId}`;
    const mockFn = jest
      .spyOn(MockClientProxy, 'send')
      .mockReturnValueOnce(mockRes);
    const res = controller.sendMessage(mockMessage);

    expect(mockFn).toHaveBeenCalledWith(MESSAGE_PATTERNS.SEND, mockPayload);
    expect(res).toEqual(mockRes);
    expect(res).toContain(mockMessage.recipientId);
  });

  it('should have return the payload SendMessageDto if the format is valid', async () => {
    const target: ValidationPipe = new ValidationPipe({
      transform: true,
      whitelist: true,
    });
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: SendMessageDto,
      data: '',
    };
    const payload = {
      recipientId: 'user-123',
      content: 'hello',
    };
    const validPayload = await target.transform(payload, metadata);

    expect(validPayload).toEqual(payload);
    expect(validPayload).toBeInstanceOf(SendMessageDto);
  });

  it('should have error when payload is not valid SendMessageDto', async () => {
    const target: ValidationPipe = new ValidationPipe({
      transform: true,
      whitelist: true,
    });
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: SendMessageDto,
      data: '',
    };

    try {
      await target.transform(<SendMessageDto>{}, metadata);
    } catch (err) {
      expect(err.getResponse().message).toEqual([
        'recipientId must be a string',
        'recipientId should not be empty',
        'content must be a string',
        'content should not be empty',
      ]);
    }
  });
});
