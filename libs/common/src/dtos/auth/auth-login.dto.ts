import { applyDecorators } from '@nestjs/common';
import { IsString, IsNotEmpty } from 'class-validator';

function IsRequiredString() {
  return applyDecorators(IsString(), IsNotEmpty());
}

export class UserLoginDto {
  @IsRequiredString()
  usernameOrEmail: string;

  @IsRequiredString()
  password: string;
}
