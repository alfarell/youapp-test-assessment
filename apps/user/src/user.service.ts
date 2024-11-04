import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Error, Model } from 'mongoose';
import { Profile } from './schema/user-profile.schema';
import { ProfileResponseType } from './dto';
import { FormatResponse, ProfilePayloadDto } from '@app/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
    private readonly configService: ConfigService,
  ) {}

  async getProfile(accountId: string): ProfileResponseType {
    try {
      const profile = await this.profileModel.findOne({ accountId });

      return new FormatResponse<Profile>('Get profile success', profile);
    } catch (err) {
      throw new RpcException(new UnauthorizedException(err));
    }
  }

  async createProfile(payload: ProfilePayloadDto): ProfileResponseType {
    try {
      const profile = new this.profileModel({
        accountId: payload.accountId,
        ...payload.profile,
      });
      const saveProfile = await profile.save();

      return new FormatResponse<Profile>('Create profile success', saveProfile);
    } catch (err) {
      const errMessage = err.message;
      if (errMessage.includes('duplicate')) {
        throw new RpcException(
          new BadRequestException(
            `Profile for accountId : ${err.keyValue.accountId} already exist`,
          ),
        );
      }

      throw new RpcException(new BadRequestException(err));
    }
  }

  async updateProfile(payload: ProfilePayloadDto): ProfileResponseType {
    const accountId = payload.accountId;
    const newProfile = payload.profile;

    try {
      const updateProfile = await this.profileModel.findOneAndUpdate(
        { accountId },
        newProfile,
        { new: true },
      );

      return new FormatResponse<Profile>(
        'Update profile success',
        updateProfile,
      );
    } catch (err) {
      if (err instanceof Error.CastError) {
        if (err.kind === 'ObjectId' && err.path === 'accountId') {
          throw new RpcException(new UnauthorizedException());
        }
      }

      throw new RpcException(new BadRequestException(err));
    }
  }
}
