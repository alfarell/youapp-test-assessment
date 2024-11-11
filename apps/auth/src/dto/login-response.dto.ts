import { FormatResponse } from '@app/common';
// import { Account } from '../schema';

export interface AccessTokenType {
  tokenType: string;
  accessToken: string;
}

// export interface AccountType {
//   username: string;
//   email: string;
// }

export class SessionResponseDto {
  token: AccessTokenType;
  // account: AccountType;

  constructor(
    access: AccessTokenType,
    // account: Account
  ) {
    this.token = access;
    // this.account = {
    //   username: account.username,
    //   email: account.email,
    // };
  }
}

export type LoginResponse = Promise<FormatResponse<SessionResponseDto>>;
