import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from './message.service';
import {
  CLIENTS_NAME,
  ConversatoinParams,
  FormatRpcRequest,
  MESSAGE_PATTERNS,
  SendMessageDto,
} from '@app/common';
import { MockClientProxy, MockRequest } from '@app/test';
import { REQUEST } from '@nestjs/core';

const mockHeaders = { accountId: 'account-id-123' };

describe('MessageService', () => {
  let service: MessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
      ],
    }).compile();

    service = await module.resolve<MessageService>(MessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
    const res = service.viewMessages();

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
    const res = service.getConversations();

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
    const res = service.getConversationById(conversationId);

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
    const res = service.sendMessage(mockMessage);

    expect(mockFn).toHaveBeenCalledWith(MESSAGE_PATTERNS.SEND, mockPayload);
    expect(res).toEqual(mockRes);
    expect(res).toContain(mockMessage.recipientId);
  });
});
