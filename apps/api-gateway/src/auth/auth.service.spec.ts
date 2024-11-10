import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import {
  AUTH_PATTERNS,
  CLIENTS_NAME,
  CreateAccountDto,
  UserLoginDto,
} from '@app/common';
import { MockClientProxy } from '@app/test';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: CLIENTS_NAME.AUTH_SERVIC,
          useValue: MockClientProxy,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return accountId on register service success', () => {
    const createAccount: CreateAccountDto = {
      username: 'test',
      email: 'test@email.com',
      password: 'test',
    };
    const mockRes = {
      accountId: '123',
    };
    const mockFn = jest
      .spyOn(MockClientProxy, 'send')
      .mockReturnValueOnce(mockRes);
    const res = service.register(createAccount);

    expect(mockFn).toHaveBeenCalledWith(AUTH_PATTERNS.REGISTER, {
      data: createAccount,
    });
    expect(res).toEqual(mockRes);
  });

  it('should return token on login service success', () => {
    const loginAccount: UserLoginDto = {
      usernameOrEmail: 'test',
      password: 'test',
    };
    const mockRes = {
      token: 'ABC123',
    };
    const mockFn = jest
      .spyOn(MockClientProxy, 'send')
      .mockReturnValueOnce(mockRes);
    const res = service.login(loginAccount);

    expect(mockFn).toHaveBeenCalledWith(AUTH_PATTERNS.LOGIN, {
      data: loginAccount,
    });
    expect(res).toEqual(mockRes);
  });
});
