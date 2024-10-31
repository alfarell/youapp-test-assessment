import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(@Inject('USER_CLIENT') private userClient: ClientProxy) {}

  create(createUserDto: CreateUserDto) {
    return this.userClient.send('user', {});
  }

  findAll() {
    return this.userClient.send('user', {});
  }

  findOne(id: number) {
    return this.userClient.send('user', {});
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userClient.send('user', {});
  }

  remove(id: number) {
    return this.userClient.send('user', {});
  }
}
