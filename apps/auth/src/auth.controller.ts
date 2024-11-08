import { Body, Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
import {
  AUTH_PATTERNS,
  CreateAccountDto,
  FormatRpcRequest,
  UserLoginDto,
} from '@app/common';
import { LoginResponse, RegisterResponse } from './dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(AUTH_PATTERNS.REGISTER)
  registerAccount(
    @Body() payload: FormatRpcRequest<CreateAccountDto>,
  ): RegisterResponse {
    return this.authService.register(payload);
  }

  @MessagePattern(AUTH_PATTERNS.LOGIN)
  loginAccount(@Body() payload: FormatRpcRequest<UserLoginDto>): LoginResponse {
    return this.authService.login(payload);
  }
}
