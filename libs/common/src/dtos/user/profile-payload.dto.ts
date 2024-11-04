import { CreateProfileDto } from './create-user-profile.dto';
import { UpdateProfileDto } from './update-user-profile.dto';

export class ProfilePayloadDto {
  accountId: string;
  profile: CreateProfileDto | UpdateProfileDto;

  constructor(accountId: string, profile: CreateProfileDto | UpdateProfileDto) {
    this.accountId = accountId;
    this.profile = profile;
  }
}
