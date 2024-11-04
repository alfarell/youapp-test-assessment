import { Controller, Post, Body, Get, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateProfileDto, UpdateProfileDto } from '@app/common';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('getProfile')
  getOne() {
    return this.userService.getOne();
  }

  @Post('createProfile')
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.userService.create(createProfileDto);
  }

  @Put('updateProfile')
  update(@Body() updateProfileDto: UpdateProfileDto) {
    return this.userService.update(updateProfileDto);
  }
}
