import { Inject, Injectable, Request, Scope } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  CLIENTS_NAME,
  CreateProfileDto,
  ProfilePayloadDto,
  USER_PATTERNS,
} from '@app/common';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    @Inject(CLIENTS_NAME.USER_SERVICE) private userClient: ClientProxy,
  ) {}

  get() {
    const accountId = this.request.headers['accountId'];
    return this.userClient.send(USER_PATTERNS.GET_PROFILE, accountId);
  }

  create(createProfileDto: CreateProfileDto) {
    const accountId = this.request.headers['accountId'];
    const payload: ProfilePayloadDto = {
      accountId,
      ...createProfileDto,
    };
    return this.userClient.send(USER_PATTERNS.CREATE_PROFILE, payload);
  }
}
