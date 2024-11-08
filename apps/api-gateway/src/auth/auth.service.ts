import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  AUTH_PATTERNS,
  CLIENTS_NAME,
  CreateAccountDto,
  FormatRpcRequest,
  UserLoginDto,
} from '@app/common';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CLIENTS_NAME.AUTH_SERVIC) private readonly authClient: ClientProxy,
  ) {}

  register(createAccountDto: CreateAccountDto) {
    const payload = new FormatRpcRequest<CreateAccountDto>({
      data: createAccountDto,
    });
    return this.authClient.send(AUTH_PATTERNS.REGISTER, payload);
  }

  login(userLoginDto: UserLoginDto) {
    const payload = new FormatRpcRequest<UserLoginDto>({
      data: userLoginDto,
    });
    return this.authClient.send(AUTH_PATTERNS.LOGIN, payload);
  }
}
