import { IsNotEmptyObject, IsObject, ValidateNested } from 'class-validator';
import { SendMessageDto } from './send-message.dto';
import { Type } from 'class-transformer';
import { IsRequiredString } from '../custom-validators';

export class CreateMessageDto {
  @IsRequiredString()
  accountId: string;

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => SendMessageDto)
  data: SendMessageDto;
}
