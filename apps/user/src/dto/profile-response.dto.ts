import { Profile } from '../schema';

export class ProfileResponseDto {
  profile: Profile;

  constructor(profile: Profile) {
    this.profile = profile;
  }
}
