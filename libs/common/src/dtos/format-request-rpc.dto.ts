export interface AccountParams {
  accountId?: string;
}

export class FormatRpcRequest<T = any, U = AccountParams> {
  readonly data?: T;
  readonly params?: U & Partial<AccountParams>;

  constructor({
    data,
    params,
  }: {
    data?: T;
    params?: U & Partial<AccountParams>;
  }) {
    this.data = data;
    this.params = params;
  }
}
