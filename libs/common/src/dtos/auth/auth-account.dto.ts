import { IsNotEmpty, IsEmail } from 'class-validator';
import { IsRequiredString } from '../custom-validators';

export class CreateAccountDto {
  @IsRequiredString()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsRequiredString()
  password: string;
}
