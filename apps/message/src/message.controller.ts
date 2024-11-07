import { Controller } from '@nestjs/common';
import { MessageService } from './message.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CreateMessageDto, MESSAGE_PATTERNS } from '@app/common';

@Controller()
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @MessagePattern(MESSAGE_PATTERNS.VIEW)
  viewMessage(@Payload() accountId: string) {
    return this.messageService.viewMessage(accountId);
  }

  @MessagePattern(MESSAGE_PATTERNS.SEND)
  sendMessage(
    @Payload() payload: CreateMessageDto,
    @Ctx() context: RmqContext,
  ) {
    return this.messageService.sendMessage(payload, context);
  }
}
