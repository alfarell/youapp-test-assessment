import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { MessageService } from './message.service';
import { SendMessageDto } from '@app/common';
import { GetConversationParamId } from '@app/common';

@Controller()
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('viewMessages')
  viewMessages() {
    return this.messageService.viewMessages();
  }

  @Get('getConversations')
  getConversations() {
    return this.messageService.getConversations();
  }

  @Get('getConversation/:id')
  getConversationById(
    @Param('id', new GetConversationParamId('id')) conversationId: string,
  ) {
    return this.messageService.getConversationById(conversationId);
  }

  @Post('sendMessage')
  sendMessage(@Body() sendMessageDto: SendMessageDto) {
    return this.messageService.sendMessage(sendMessageDto);
  }
}
