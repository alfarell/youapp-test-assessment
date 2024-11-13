import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { MessageService } from './message.service';
import { SendMessageDto } from '@app/common';
import { GetConversationParamId } from '@app/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller()
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @ApiBearerAuth('accessToken')
  @Get('viewMessages')
  viewMessages() {
    return this.messageService.viewMessages();
  }

  @ApiBearerAuth('accessToken')
  @Get('getConversations')
  getConversations() {
    return this.messageService.getConversations();
  }

  @ApiBearerAuth('accessToken')
  @Get('getConversation/:id')
  getConversationById(
    @Param('id', new GetConversationParamId('id')) conversationId: string,
  ) {
    return this.messageService.getConversationById(conversationId);
  }

  @ApiBearerAuth('accessToken')
  @Post('sendMessage')
  sendMessage(@Body() sendMessageDto: SendMessageDto) {
    return this.messageService.sendMessage(sendMessageDto);
  }
}
