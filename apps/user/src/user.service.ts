import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Error, Model } from 'mongoose';
import { Profile } from './schema/user-profile.schema';
import { ProfileResponseType } from './dto';
import {
  CreateProfileDto,
  FormatResponse,
  FormatRpcRequest,
  UpdateProfileDto,
} from '@app/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
  ) {}

  async getProfile(payload: FormatRpcRequest): ProfileResponseType {
    const { accountId } = payload.params;

    try {
      const profile = await this.profileModel
        .findOne({ accountId })
        .select('-createdAt -updatedAt');

      return new FormatResponse<Profile>(
        'Get profile success',
        profile.toJSON(),
      );
    } catch (err) {
      throw new RpcException(new UnauthorizedException(err));
    }
  }

  async createProfile(
    payload: FormatRpcRequest<CreateProfileDto>,
  ): ProfileResponseType {
    const { accountId } = payload.params;
    const profile = payload.data;

    try {
      const createProfile = new this.profileModel({
        accountId,
        ...profile,
      });
      const saveProfile = await createProfile.save();

      return new FormatResponse<Profile>(
        'Create profile success',
        saveProfile.toJSON(),
      );
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

  async updateProfile(
    payload: FormatRpcRequest<UpdateProfileDto>,
  ): ProfileResponseType {
    const { accountId } = payload.params;
    const newProfile = payload.data;

    try {
      const updateProfile = await this.profileModel
        .findOneAndUpdate({ accountId }, newProfile, { new: true })
        .select('-createdAt -updatedAt');

      return new FormatResponse<Profile>(
        'Update profile success',
        updateProfile.toJSON(),
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
