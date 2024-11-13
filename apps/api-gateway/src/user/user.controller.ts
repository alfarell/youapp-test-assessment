import { Controller, Post, Body, Get, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateProfileDto, UpdateProfileDto } from '@app/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth('accessToken')
  @Get('getProfile')
  getOne() {
    return this.userService.getOne();
  }

  @ApiBearerAuth('accessToken')
  @Post('createProfile')
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.userService.create(createProfileDto);
  }

  @ApiBearerAuth('accessToken')
  @Put('updateProfile')
  update(@Body() updateProfileDto: UpdateProfileDto) {
    return this.userService.update(updateProfileDto);
  }
}
