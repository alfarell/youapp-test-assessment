import { IsNotEmpty, IsEmail } from 'class-validator';
import { IsRequiredString } from '../custom-validators';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountDto {
  @ApiProperty()
  @IsRequiredString()
  username: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsRequiredString()
  password: string;
}
