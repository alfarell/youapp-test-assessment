import { applyDecorators } from '@nestjs/common';
import {
  IsString,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { SendMessageDto } from './send-message.dto';
import { Type } from 'class-transformer';

function IsRequiredString() {
  return applyDecorators(IsString(), IsNotEmpty());
}

export class CreateMessageDto {
  @IsRequiredString()
  accountId: string;

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => SendMessageDto)
  data: SendMessageDto;
}
