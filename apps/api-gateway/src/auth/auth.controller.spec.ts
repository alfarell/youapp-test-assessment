import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  AUTH_PATTERNS,
  CLIENTS_NAME,
  CreateAccountDto,
  UserLoginDto,
} from '@app/common';
import { MockClientProxy } from '@app/test';
import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

const createAccount: CreateAccountDto = {
  username: 'test',
  email: 'test@email.com',
  password: 'test',
};
const loginAccount: UserLoginDto = {
  usernameOrEmail: 'test',
  password: 'test',
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: CLIENTS_NAME.AUTH_SERVIC,
          useValue: MockClientProxy,
        },
        {
          provide: APP_PIPE,
          useValue: ValidationPipe,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return accountId on register controller success', () => {
    const mockRes = {
      accountId: '123',
    };
    const mockFn = jest
      .spyOn(MockClientProxy, 'send')
      .mockReturnValueOnce(mockRes);
    const res = controller.register(createAccount);

    expect(mockFn).toHaveBeenCalledWith(AUTH_PATTERNS.REGISTER, {
      data: createAccount,
    });
    expect(res).toEqual(mockRes);
  });

  it('should return token on login controller success', () => {
    const mockRes = {
      token: 'ABC123',
    };
    const mockFn = jest
      .spyOn(MockClientProxy, 'send')
      .mockReturnValueOnce(mockRes);
    const res = controller.login(loginAccount);

    expect(mockFn).toHaveBeenCalledWith(AUTH_PATTERNS.LOGIN, {
      data: loginAccount,
    });
    expect(res).toEqual(mockRes);
  });

  it('should have return the payload CreateAccountDto if the format is valid', async () => {
    const target: ValidationPipe = new ValidationPipe({
      transform: true,
      whitelist: true,
    });
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: CreateAccountDto,
      data: '',
    };
    const payload = createAccount;
    const validPayload = await target.transform(payload, metadata);

    expect(validPayload).toEqual(payload);
    expect(validPayload).toBeInstanceOf(CreateAccountDto);
  });

  it('should have error when payload is not valid CreateAccountDto', async () => {
    const target: ValidationPipe = new ValidationPipe({
      transform: true,
      whitelist: true,
    });
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: CreateAccountDto,
      data: '',
    };

    try {
      await target.transform(<CreateAccountDto>{}, metadata);
    } catch (err) {
      expect(err.getResponse().message).toEqual([
        'username must be a string',
        'username should not be empty',
        'email should not be empty',
        'email must be an email',
        'password must be a string',
        'password should not be empty',
      ]);
    }
  });

  it('should have return the payload UserLoginDto if the format is valid', async () => {
    const target: ValidationPipe = new ValidationPipe({
      transform: true,
      whitelist: true,
    });
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: UserLoginDto,
      data: '',
    };
    const payload = loginAccount;
    const validPayload = await target.transform(payload, metadata);

    expect(validPayload).toEqual(payload);
    expect(validPayload).toBeInstanceOf(UserLoginDto);
  });

  it('should have error when payload is not valid UserLoginDto', async () => {
    const target: ValidationPipe = new ValidationPipe({
      transform: true,
      whitelist: true,
    });
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: UserLoginDto,
      data: '',
    };

    try {
      await target.transform(<UserLoginDto>{}, metadata);
    } catch (err) {
      expect(err.getResponse().message).toEqual([
        'usernameOrEmail must be a string',
        'usernameOrEmail should not be empty',
        'password must be a string',
        'password should not be empty',
      ]);
    }
  });
});
