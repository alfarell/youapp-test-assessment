import { PartialType } from '@nestjs/mapped-types';
import { CreateProfileDto } from './create-user-profile.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto extends PartialType(CreateProfileDto) {
  @ApiProperty()
  name?: string;
  @ApiProperty()
  birthday?: string;
  @ApiProperty()
  gender?: string;
  @ApiProperty()
  height?: number;
  @ApiProperty()
  weight?: number;
}
