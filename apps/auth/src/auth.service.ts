import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {
  CreateAccountDto,
  FormatResponse,
  FormatRpcRequest,
  TokenPayload,
  UserLoginDto,
} from '@app/common';
import { Account, Session } from './schema';
import {
  AccessTokenType,
  AccountResponseDto,
  LoginResponse,
  RegisterResponse,
  SessionResponseDto,
} from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<Account>,
    @InjectModel(Session.name) private sessionModel: Model<Session>,
    private readonly jwtService: JwtService,
  ) {}

  // public methods:
  async register(
    payload: FormatRpcRequest<CreateAccountDto>,
  ): RegisterResponse {
    await this._validateCraeteAccount(payload.data);

    const { username, email, password } = payload.data;
    const salt = await bcrypt.genSalt();
    const passwordHashed = await bcrypt.hash(password, salt);
    const createAccount = await this.accountModel.create({
      username,
      email,
      password: passwordHashed,
    });

    return new FormatResponse<AccountResponseDto>(
      'Register new account success',
      new AccountResponseDto(createAccount),
    );
  }

  async login(userLoginDto: FormatRpcRequest<UserLoginDto>): LoginResponse {
    const { usernameOrEmail, password } = userLoginDto.data;

    const account = await this._validateAccount(usernameOrEmail);
    await this._validatePassword(password, account.password);
    const session = await this._createSession(account);
    const access = this._createAccessToken(account, session);

    return new FormatResponse<SessionResponseDto>(
      'Login success',
      new SessionResponseDto(access),
    );
  }

  // private methods:
  private async _validateCraeteAccount(userAccountData: CreateAccountDto) {
    const { email, username } = userAccountData;

    if (await this._isDataExist({ email })) {
      throw new ConflictException(`Email "${email}" already registered`);
    }

    if (await this._isDataExist({ username })) {
      throw new ConflictException(`Username "${username}" already exist`);
    }

    return true;
  }

  private async _isDataExist(data) {
    const user = await this.accountModel.findOne(data);
    return !!user;
  }

  private async _validatePassword(password: string, encryptedPassword: string) {
    const isValid = await bcrypt.compare(password, encryptedPassword || '');

    if (!isValid) {
      throw new UnauthorizedException('Invalid credential');
    }
  }

  private async _validateAccount(usernameOrEmail: string): Promise<Account> {
    const userAccount = await this.accountModel.findOne({
      $or: [
        {
          email: usernameOrEmail,
        },
        {
          username: usernameOrEmail,
        },
      ],
    });

    if (!userAccount) {
      throw new NotFoundException(
        `Account with "${usernameOrEmail}" username/email not found`,
      );
    }

    return userAccount;
  }

  private async _createSession(account: Account): Promise<Session> {
    const session = await this.sessionModel.create({
      accountId: account.id,
    });

    return session;
  }

  private _createAccessToken(
    account: Account,
    session: Session,
  ): AccessTokenType {
    const payload: TokenPayload = {
      accountId: account.id,
    };

    const accessToken = this.jwtService.sign(payload, {
      jwtid: session.id,
    });

    return {
      tokenType: 'Bearer',
      accessToken,
    };
  }
}
