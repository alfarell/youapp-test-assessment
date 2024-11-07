import { applyDecorators } from '@nestjs/common';
import { IsString, IsNotEmpty } from 'class-validator';

function IsRequiredString() {
  return applyDecorators(IsString(), IsNotEmpty());
}

export class SendMessageDto {
  @IsRequiredString()
  receiverId: string;

  @IsRequiredString()
  content: string;
}
