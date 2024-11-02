import { Body, Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { AUTH_PATTERNS, CreateAccountDto, UserLoginDto } from '@app/common';
import { AccountResponseDto, SessionResponseDto } from './dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(AUTH_PATTERNS.REGISTER)
  registerAccount(
    @Body() payload: CreateAccountDto,
  ): Promise<AccountResponseDto> {
    return this.authService.register(payload);
  }

  @MessagePattern(AUTH_PATTERNS.LOGIN)
  loginAccount(@Body() payload: UserLoginDto): Promise<SessionResponseDto> {
    return this.authService.login(payload);
  }
}
