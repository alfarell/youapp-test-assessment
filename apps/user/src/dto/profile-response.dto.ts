import { FormatResponse } from '@app/common';
import { Profile } from '../schema';

export type ProfileResponseType<T = Profile> = Promise<FormatResponse<T>>;
