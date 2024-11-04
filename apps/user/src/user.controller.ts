import { Body, Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern } from '@nestjs/microservices';
import { ProfilePayloadDto, USER_PATTERNS } from '@app/common';
import { ProfileResponseType } from './dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(USER_PATTERNS.GET_PROFILE)
  getProfile(@Body() accountId: string): ProfileResponseType {
    return this.userService.getProfile(accountId);
  }

  @MessagePattern(USER_PATTERNS.CREATE_PROFILE)
  createProfile(@Body() payload: ProfilePayloadDto): ProfileResponseType {
    return this.userService.createProfile(payload);
  }

  @MessagePattern(USER_PATTERNS.UPDATE_PROFILE)
  updateProfile(@Body() payload: ProfilePayloadDto): ProfileResponseType {
    return this.userService.updateProfile(payload);
  }
}
