import { Body, Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { AUTH_PATTERNS, CreateAccountDto } from '@app/common';
import { AccountResponseDto } from './dto/account-response.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(AUTH_PATTERNS.REGISTER)
  registerAccount(
    @Body() payload: CreateAccountDto,
  ): Promise<AccountResponseDto> {
    return this.authService.register(payload);
  }
}
