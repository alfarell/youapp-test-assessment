import { Gender } from '@app/common/constants';
import { applyDecorators } from '@nestjs/common';
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  MaxLength,
  IsEnum,
  IsNumber,
} from 'class-validator';

function IsRequiredString() {
  return applyDecorators(IsString(), IsNotEmpty());
}

function IsRequiredNumber() {
  return applyDecorators(IsNumber(), IsNotEmpty());
}

export class CreateProfileDto {
  @IsRequiredString()
  @MaxLength(100)
  name: string;

  @IsRequiredString()
  @IsEnum(Gender)
  gender: string;

  @IsDateString()
  @IsRequiredString()
  birthday: string;

  @IsRequiredNumber()
  height: number;

  @IsRequiredNumber()
  weight: number;
}
