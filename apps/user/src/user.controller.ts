import { Body, Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern } from '@nestjs/microservices';
import {
  CreateProfileDto,
  FormatRpcRequest,
  UpdateProfileDto,
  USER_PATTERNS,
} from '@app/common';
import { ProfileResponseType } from './dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(USER_PATTERNS.GET_PROFILE)
  getProfile(@Body() payload: FormatRpcRequest): ProfileResponseType {
    return this.userService.getProfile(payload);
  }

  @MessagePattern(USER_PATTERNS.CREATE_PROFILE)
  createProfile(
    @Body() payload: FormatRpcRequest<CreateProfileDto>,
  ): ProfileResponseType {
    return this.userService.createProfile(payload);
  }

  @MessagePattern(USER_PATTERNS.UPDATE_PROFILE)
  updateProfile(
    @Body() payload: FormatRpcRequest<UpdateProfileDto>,
  ): ProfileResponseType {
    return this.userService.updateProfile(payload);
  }
}
