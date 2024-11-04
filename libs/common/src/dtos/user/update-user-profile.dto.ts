import { PartialType } from '@nestjs/mapped-types';
import { CreateProfileDto } from './create-user-profile.dto';

export class UpdateProfileDto extends PartialType(CreateProfileDto) {}
