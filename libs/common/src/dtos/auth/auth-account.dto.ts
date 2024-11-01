import { applyDecorators } from '@nestjs/common';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

function IsRequiredString() {
  return applyDecorators(IsString(), IsNotEmpty());
}

export class CreateAccountDto {
  @IsRequiredString()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsRequiredString()
  password: string;
}
