import { Gender } from '@app/common/constants';
import { IsDateString, MaxLength, IsEnum } from 'class-validator';
import { IsRequiredNumber, IsRequiredString } from '../custom-validators';

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
