import { ApiProperty } from '@nestjs/swagger';
import { IsRequiredString } from '../custom-validators';

export class SendMessageDto {
  @ApiProperty({
    description: 'user profile id ("_id" from get profile)',
  })
  @IsRequiredString()
  recipientId: string;

  @ApiProperty()
  @IsRequiredString()
  content: string;
}
