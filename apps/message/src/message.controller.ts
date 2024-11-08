import { Controller } from '@nestjs/common';
import { MessageService } from './message.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import {
  FormatRpcRequest,
  MESSAGE_PATTERNS,
  SendMessageDto,
} from '@app/common';

@Controller()
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @MessagePattern(MESSAGE_PATTERNS.VIEW)
  viewMessage(@Payload() payload: FormatRpcRequest) {
    return this.messageService.viewMessage(payload);
  }

  @MessagePattern(MESSAGE_PATTERNS.SEND)
  sendMessage(
    @Payload() payload: FormatRpcRequest<SendMessageDto>,
    @Ctx() context: RmqContext,
  ) {
    return this.messageService.sendMessage(payload, context);
  }
}
