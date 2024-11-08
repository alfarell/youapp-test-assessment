import {
  CLIENTS_NAME,
  FormatRpcRequest,
  MESSAGE_PATTERNS,
  SendMessageDto,
} from '@app/common';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';

@Injectable({ scope: Scope.REQUEST })
export class MessageService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    @Inject(CLIENTS_NAME.MESSAGE_VIEW_RMQ_SERVICE)
    private readonly rmqViewMessageClient: ClientProxy,
    @Inject(CLIENTS_NAME.MESSAGE_SEND_RMQ_SERVICE)
    private readonly rmqSendMessageClient: ClientProxy,
  ) {}

  viewMessages() {
    const accountId = this.request.headers['accountId'];
    const payload = new FormatRpcRequest({
      params: {
        accountId,
      },
    });
    return this.rmqViewMessageClient.send(MESSAGE_PATTERNS.VIEW, payload);
  }

  sendMessage(sendMessageDto: SendMessageDto) {
    const accountId = this.request.headers['accountId'];
    const payload = new FormatRpcRequest<SendMessageDto>({
      params: {
        accountId,
      },
      data: sendMessageDto,
    });
    return this.rmqSendMessageClient.send(MESSAGE_PATTERNS.SEND, payload);
  }
}
