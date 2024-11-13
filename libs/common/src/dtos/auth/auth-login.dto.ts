import { ApiProperty } from '@nestjs/swagger';
import { IsRequiredString } from '../custom-validators';

export class UserLoginDto {
  @ApiProperty()
  @IsRequiredString()
  usernameOrEmail: string;

  @ApiProperty()
  @IsRequiredString()
  password: string;
}
