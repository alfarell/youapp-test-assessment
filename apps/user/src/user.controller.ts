import { Body, Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern } from '@nestjs/microservices';
import { ProfilePayloadDto, USER_PATTERNS } from '@app/common';
import { ProfileResponseDto } from './dto';
import { Profile } from './schema';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(USER_PATTERNS.GET_PROFILE)
  getProfile(@Body() accountId: string): Promise<Profile> {
    return this.userService.getProfile(accountId);
  }

  @MessagePattern(USER_PATTERNS.CREATE_PROFILE)
  createProfile(
    @Body() payload: ProfilePayloadDto,
  ): Promise<ProfileResponseDto> {
    return this.userService.createProfile(payload);
  }

  @MessagePattern(USER_PATTERNS.UPDATE_PROFILE)
  updateProfile(@Body() payload): Promise<ProfileResponseDto> {
    return this.userService.updateProfile(payload);
  }
}
