import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateAccountDto } from '@app/common';
import { Account } from './schema/auth-account.schema';
import { RpcException } from '@nestjs/microservices';
import { AccountResponseDto } from './dto/account-response.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(Account.name) private userModel: Model<Account>) {}

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
}
