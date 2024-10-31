import { Inject, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(@Inject('AUTH_CLIENT') private userClient: ClientProxy) {}

  create(createAuthDto: CreateAuthDto) {
    return this.userClient.send('auth', {});
  }

  findAll() {
    return this.userClient.send('auth', {});
  }

  findOne(id: number) {
    return this.userClient.send('auth', {});
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return this.userClient.send('auth', {});
  }

  remove(id: number) {
    return this.userClient.send('auth', {});
  }
}
