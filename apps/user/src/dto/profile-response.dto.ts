import { FormatResponse } from '@app/common';
import { Profile } from '../schema';

export type ProfileResponseType = Promise<FormatResponse<Profile>>;
