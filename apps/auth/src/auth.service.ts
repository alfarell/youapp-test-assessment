import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateAccountDto, UserLoginDto } from '@app/common';
import { Account, Session } from './schema';
import { RpcException } from '@nestjs/microservices';
import { AccessTokenType, AccountResponseDto, SessionResponseDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Account.name) private userModel: Model<Account>,
    @InjectModel(Session.name) private sessionModel: Model<Session>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  // public methods:
  async register(payload: CreateAccountDto): Promise<AccountResponseDto> {
    await this._validateCraeteAccount(payload);

    const { username, email, password } = payload;
    const salt = await bcrypt.genSalt();
    const passwordHashed = await bcrypt.hash(password, salt);
    const createAccount = new this.userModel({
      username,
      email,
      password: passwordHashed,
    });
    const account = await createAccount.save();

    console.log(account.toJSON());

    return new AccountResponseDto(account);
  }

  async login(userLoginDto: UserLoginDto): Promise<SessionResponseDto> {
    const { usernameOrEmail, password } = userLoginDto;

    const account = await this._validateAccount(usernameOrEmail);
    await this._validatePassword(password, account.password);
    const session = await this._createSession(account);
    const access = this._createAccessToken(account, session);

    return new SessionResponseDto(access, account);
  }

  // private methods:
  private async _validateCraeteAccount(userAccountData: CreateAccountDto) {
    const { email, username } = userAccountData;

    if (await this._isDataExist({ email })) {
      throw new RpcException(
        new ConflictException(`Email "${email}" already registered`),
      );
    }

    if (await this._isDataExist({ username })) {
      throw new RpcException(
        new ConflictException(`Username "${username}" already exist`),
      );
    }

    return true;
  }

  private async _isDataExist(data) {
    const user = await this.userModel.findOne(data).exec();
    return !!user;
  }

  private async _validatePassword(password: string, encryptedPassword: string) {
    const isValid = await bcrypt.compare(password, encryptedPassword || '');

    if (!isValid) {
      throw new RpcException(new UnauthorizedException('Invalid credential'));
    }
  }

  private async _validateAccount(usernameOrEmail: string): Promise<Account> {
    const userAccount = await this.userModel.findOne({
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
      throw new RpcException(
        new NotFoundException(
          `Account with "${usernameOrEmail}" username/email not found`,
        ),
      );
    }

    return userAccount;
  }

  private async _createSession(account: Account): Promise<Session> {
    const session = new this.sessionModel({
      accountId: account.id,
    });
    const saveSession = await session.save();

    return saveSession;
  }

  private _createAccessToken(
    account: Account,
    session: Session,
  ): AccessTokenType {
    const refreshTokenSecret = this.configService.get<string>(
      'REFRESH_TOKEN_SECRET',
    );
    const refreshExpiresIn = this.configService.get<number>(
      'REFRESH_TOKEN_EXPIRES',
    );

    const accessToken = this.jwtService.sign(
      {
        acc: account.id,
      },
      {
        jwtid: session.id,
      },
    );

    const refreshToken = this.jwtService.sign(
      {
        acc: account.id,
      },
      {
        secret: refreshTokenSecret,
        expiresIn: refreshExpiresIn,
        jwtid: session.id,
      },
    );

    return {
      tokenType: 'bearer',
      accessToken,
      refreshToken,
    };
  }
}
