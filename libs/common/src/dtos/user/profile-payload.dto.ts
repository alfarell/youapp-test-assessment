import { TokenPayload } from '@app/common/constants';
import { CreateProfileDto } from './create-user-profile.dto';

export interface ProfilePayloadDto extends CreateProfileDto, TokenPayload {}
