import { IsRequiredString } from '../custom-validators';

export class SendMessageDto {
  @IsRequiredString()
  receiverId: string;

  @IsRequiredString()
  content: string;
}
