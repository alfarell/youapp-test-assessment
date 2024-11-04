import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateProfileDto } from '@app/common';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('createProfile')
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.userService.create(createProfileDto);
  }
}
