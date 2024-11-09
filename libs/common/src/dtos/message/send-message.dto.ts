import { IsRequiredString } from '../custom-validators';

export class SendMessageDto {
  @IsRequiredString()
  recipientId: string;

  @IsRequiredString()
  content: string;
}
