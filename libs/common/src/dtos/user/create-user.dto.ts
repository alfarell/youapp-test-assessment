import { applyDecorators } from '@nestjs/common';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export function IsRequiredString() {
  return applyDecorators(IsString(), IsNotEmpty());
}

export class CreateUserDto {
  @IsRequiredString()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsRequiredString()
  password: string;
}
