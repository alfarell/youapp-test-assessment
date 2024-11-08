import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export function IsRequiredString() {
  return applyDecorators(IsString(), IsNotEmpty());
}

export function IsRequiredNumber() {
  return applyDecorators(IsNumber(), IsNotEmpty());
}
