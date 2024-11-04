import { genderEnum } from '@app/common/constants';
import {
  IsString,
  IsDateString,
  MaxLength,
  IsEnum,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @MaxLength(100)
  @IsOptional()
  name: string;

  @IsString()
  @IsEnum(genderEnum)
  @IsOptional()
  gender: string;

  @IsDateString()
  @IsString()
  @IsOptional()
  birthday: string;

  @IsNumber()
  @IsOptional()
  height: number;

  @IsNumber()
  @IsOptional()
  weight: number;
}
