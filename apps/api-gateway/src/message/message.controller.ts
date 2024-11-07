import { Controller, Post, Body, Get } from '@nestjs/common';
import { MessageService } from './message.service';
import { SendMessageDto } from '@app/common';

@Controller()
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('viewMessages')
  viewMessages() {
    return this.messageService.viewMessages();
  }

  @Post('sendMessage')
  sendMessage(@Body() sendMessageDto: SendMessageDto) {
    return this.messageService.sendMessage(sendMessageDto);
  }
}
