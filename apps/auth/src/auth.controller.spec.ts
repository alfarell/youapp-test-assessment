import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import {
  CreateAccountDto,
  CustomRpcExceptionFilter,
  FormatResponse,
  FormatRpcRequest,
  MongoExceptionFilter,
  UserLoginDto,
} from '@app/common';
import { Account, Session } from './schema';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';
import { AccountResponseDto, SessionResponseDto } from './dto';
import { JwtModule } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

const createAccount: CreateAccountDto = {
  username: 'test',
  email: 'test@email.com',
  password: 'test',
};
const loginAccount: UserLoginDto = {
  usernameOrEmail: 'test',
  password: 'test',
};
const RegisterResponseInstance = FormatResponse<AccountResponseDto>;
const LoginResponseInstance = FormatResponse<SessionResponseDto>;

describe('AuthController', () => {
  let authController: AuthController;
  let accountModel: Model<Account>;
  let sessionModel: Model<Session>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      imports: [
        JwtModule.register({
          secret: 'ABCdef123',
          signOptions: {
            expiresIn: 3600,
            algorithm: 'HS512',
          },
        }),
      ],
      providers: [
        AuthService,
        { provide: APP_FILTER, useClass: CustomRpcExceptionFilter },
        { provide: APP_FILTER, useClass: MongoExceptionFilter },
        {
          provide: APP_PIPE,
          useValue: ValidationPipe,
        },
        {
          provide: getModelToken(Account.name),
          useValue: Model,
        },
        {
          provide: getModelToken(Session.name),
          useValue: Model,
        },
      ],
    }).compile();

    authController = await app.resolve<AuthController>(AuthController);
    accountModel = app.get<Model<Account>>(getModelToken(Account.name));
    sessionModel = app.get<Model<Session>>(getModelToken(Session.name));
  });

  describe('register', () => {
    it('should return accountId when register is success', async () => {
      const payload = new FormatRpcRequest<CreateAccountDto>({
        data: createAccount,
      });
      const mockRes = {
        _id: 'abc-123',
        id: 'abc-123',
        ...createAccount,
      };

      jest.spyOn(accountModel, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(accountModel, 'create')
        .mockImplementation(jest.fn().mockResolvedValueOnce(mockRes));

      const req = await authController.registerAccount(payload);

      expect(req).toBeInstanceOf(RegisterResponseInstance);
      expect(req.data).toHaveProperty('id');
      expect(req.data.id).toEqual(mockRes.id);
      expect(req.message).toEqual('Register new account success');
    });

    it('should throw error when the email is already registered', async () => {
      const payload = new FormatRpcRequest<CreateAccountDto>({
        data: createAccount,
      });

      jest.spyOn(accountModel, 'findOne').mockResolvedValueOnce(payload.data);

      try {
        await authController.registerAccount(payload);
      } catch (err) {
        expect(err).toBeInstanceOf(ConflictException);
        expect(err.message).toEqual(
          `Email "${payload.data.email}" already registered`,
        );
      }
    });

    it('should throw error when the username is already exist', async () => {
      const payload = new FormatRpcRequest<CreateAccountDto>({
        data: createAccount,
      });

      jest.spyOn(accountModel, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(accountModel, 'findOne').mockResolvedValueOnce({
        email: 'other@email.com',
        username: 'test',
      });

      try {
        await authController.registerAccount(payload);
      } catch (err) {
        expect(err).toBeInstanceOf(ConflictException);
        expect(err.message).toEqual(
          `Username "${payload.data.username}" already exist`,
        );
      }
    });
  });

  describe('login', () => {
    it('should return token when login is success', async () => {
      const payload = new FormatRpcRequest<UserLoginDto>({
        data: loginAccount,
      });
      const mockRes = {
        _id: 'abc-123',
        id: 'abc-123',
        ...createAccount,
      };

      jest.spyOn(accountModel, 'findOne').mockResolvedValueOnce(mockRes);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementationOnce(() => Promise.resolve(true));
      jest
        .spyOn(sessionModel, 'create')
        .mockImplementation(jest.fn().mockResolvedValueOnce(mockRes));

      const req = await authController.loginAccount(payload);

      expect(req).toBeInstanceOf(LoginResponseInstance);
      expect(req.data).toHaveProperty('token');
      expect(req.data.token).toHaveProperty('tokenType');
      expect(req.data.token).toHaveProperty('accessToken');
      expect(req.message).toEqual('Login success');
    });

    it('should throw error when email or username are not registered', async () => {
      const payload = new FormatRpcRequest<UserLoginDto>({
        data: loginAccount,
      });

      jest.spyOn(accountModel, 'findOne').mockResolvedValueOnce(null);

      try {
        await authController.loginAccount(payload);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toEqual(
          `Account with "${payload.data.usernameOrEmail}" username/email not found`,
        );
      }
    });

    it('should throw error when password is invalid', async () => {
      const payload = new FormatRpcRequest<UserLoginDto>({
        data: loginAccount,
      });

      jest.spyOn(accountModel, 'findOne').mockResolvedValueOnce(createAccount);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementationOnce(() => Promise.resolve(false));

      try {
        await authController.loginAccount(payload);
      } catch (err) {
        expect(err).toBeInstanceOf(UnauthorizedException);
        expect(err.message).toEqual('Invalid credential');
      }
    });
  });
});
