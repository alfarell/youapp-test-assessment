import { BadRequestException, PipeTransform } from '@nestjs/common';

export class GetConversationParamId implements PipeTransform {
  key: string;
  constructor(key: string) {
    this.key = key;
  }

  async transform(id: string) {
    if (!id) {
      throw new BadRequestException(`Param "${this.key}" is required`);
    }

    return id;
  }
}

export type ConversatoinParams = {
  conversationId?: string;
};
