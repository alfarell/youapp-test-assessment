import { Gender } from '@app/common/constants';
import { IsDateString, MaxLength, IsEnum } from 'class-validator';
import { IsRequiredNumber, IsRequiredString } from '../custom-validators';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfileDto {
  @ApiProperty()
  @IsRequiredString()
  @MaxLength(100)
  name: string;

  @ApiProperty()
  @IsRequiredString()
  @IsEnum(Gender)
  gender: string;

  @ApiProperty()
  @IsDateString()
  @IsRequiredString()
  birthday: string;

  @ApiProperty()
  @IsRequiredNumber()
  height: number;

  @ApiProperty()
  @IsRequiredNumber()
  weight: number;
}
