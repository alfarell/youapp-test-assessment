import { ApiProperty } from '@nestjs/swagger';
import { IsRequiredString } from '../custom-validators';

export class SendMessageDto {
  @ApiProperty()
  @IsRequiredString()
  recipientId: string;

  @ApiProperty()
  @IsRequiredString()
  content: string;
}
