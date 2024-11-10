export const mockEmit = jest.fn();

export const MockClientProxy = {
  send(pattern: string, data: any): any {
    return data;
  },
  emit(pattern: string, data: any): void {
    mockEmit(pattern, data);
  },
};

export class MockRequest<T> {
  headers?: T;

  constructor({ headers }: { headers?: T }) {
    this.headers = headers;
  }
}
