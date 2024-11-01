import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAccountDto } from '@app/common';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createAccountDto: CreateAccountDto) {
    return this.authService.register(createAccountDto);
  }
}
