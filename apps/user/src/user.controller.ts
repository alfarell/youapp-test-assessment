import { Body, Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern } from '@nestjs/microservices';
import { ProfilePayloadDto, USER_PATTERNS } from '@app/common';
import { ProfileResponseDto } from './dto/profile-response.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(USER_PATTERNS.CREATE_PROFILE)
  createProfile(
    @Body() payload: ProfilePayloadDto,
  ): Promise<ProfileResponseDto> {
    return this.userService.createProfile(payload);
  }
}
