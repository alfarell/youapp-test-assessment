import { Inject, Injectable, Request, Scope } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  CLIENTS_NAME,
  CreateProfileDto,
  FormatRpcRequest,
  UpdateProfileDto,
  USER_PATTERNS,
} from '@app/common';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    @Inject(CLIENTS_NAME.USER_SERVICE) private readonly userClient: ClientProxy,
  ) {}

  getOne() {
    const accountId: string = this.request.headers['accountId'];
    const payload = new FormatRpcRequest({
      params: {
        accountId,
      },
    });
    return this.userClient.send(USER_PATTERNS.GET_PROFILE, payload);
  }

  create(createProfileDto: CreateProfileDto) {
    const accountId: string = this.request.headers['accountId'];
    const payload = new FormatRpcRequest<CreateProfileDto>({
      params: {
        accountId,
      },
      data: createProfileDto,
    });
    return this.userClient.send(USER_PATTERNS.CREATE_PROFILE, payload);
  }

  update(updateProfileDto: UpdateProfileDto) {
    const accountId: string = this.request.headers['accountId'];
    const payload = new FormatRpcRequest<UpdateProfileDto>({
      params: {
        accountId,
      },
      data: updateProfileDto,
    });
    return this.userClient.send(USER_PATTERNS.UPDATE_PROFILE, payload);
  }
}
