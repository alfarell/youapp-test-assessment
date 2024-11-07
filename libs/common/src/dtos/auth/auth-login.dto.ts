import { IsRequiredString } from '../custom-validators';

export class UserLoginDto {
  @IsRequiredString()
  usernameOrEmail: string;

  @IsRequiredString()
  password: string;
}
