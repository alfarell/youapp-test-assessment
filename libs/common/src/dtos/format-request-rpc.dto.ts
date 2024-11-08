export interface AccountParams {
  accountId: string;
}

export class FormatRpcRequest<T = any, U = AccountParams> {
  readonly data?: T;
  readonly params?: U;

  constructor({ data, params }: { data?: T; params?: U }) {
    this.data = data;
    this.params = params;
  }
}
