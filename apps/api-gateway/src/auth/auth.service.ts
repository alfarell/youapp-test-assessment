import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  AUTH_PATTERNS,
  CLIENTS_NAME,
  CreateAccountDto,
  UserLoginDto,
} from '@app/common';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CLIENTS_NAME.AUTH_SERVIC) private authClient: ClientProxy,
  ) {}

  register(createAccountDto: CreateAccountDto) {
    const registeredUser = this.authClient.send(
      AUTH_PATTERNS.REGISTER,
      createAccountDto,
    );
    return registeredUser;
  }

  login(userLoginDto: UserLoginDto) {
    const registeredUser = this.authClient.send(
      AUTH_PATTERNS.LOGIN,
      userLoginDto,
    );
    return registeredUser;
  }
}
