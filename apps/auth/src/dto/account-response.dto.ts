import { Types } from 'mongoose';
import { Account } from '../schema/auth-account.schema';

export class AccountResponseDto {
  id: Types.ObjectId;

  constructor(account: Account) {
    this.id = account._id;
  }
}
