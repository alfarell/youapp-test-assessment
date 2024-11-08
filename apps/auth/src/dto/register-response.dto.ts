import { Types } from 'mongoose';
import { Account } from '../schema/auth-account.schema';
import { FormatResponse } from '@app/common';

export class AccountResponseDto {
  id: Types.ObjectId;

  constructor(account: Account) {
    this.id = account._id;
  }
}

export type RegisterResponse = Promise<FormatResponse<AccountResponseDto>>;
