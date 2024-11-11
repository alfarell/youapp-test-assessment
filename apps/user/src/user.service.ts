import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile } from './schema/user-profile.schema';
import { ProfileResponseType } from './dto';
import {
  CreateProfileDto,
  FormatResponse,
  FormatRpcRequest,
  UpdateProfileDto,
} from '@app/common';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
  ) {}

  async getProfile(payload: FormatRpcRequest): ProfileResponseType {
    const { accountId } = payload.params;
    const profile = await this._findProfile(accountId);
    return new FormatResponse<Profile>('Get profile success', profile.toJSON());
  }

  async getProfiles(
    payload: FormatRpcRequest<any, { profileIds: string[] }>,
  ): ProfileResponseType<Profile[]> {
    const { profileIds } = payload.params;

    const profiles = await this.profileModel
      .find({
        _id: {
          $in: profileIds,
        },
      })
      .select('-createdAt -updatedAt');

    return new FormatResponse<Profile[]>('Get profile success', profiles);
  }

  async createProfile(
    payload: FormatRpcRequest<CreateProfileDto>,
  ): ProfileResponseType {
    const { accountId } = payload.params;
    const profile = payload.data;

    const findProfile = await this.profileModel.findOne({
      accountId,
    });
    if (findProfile) {
      throw new BadRequestException(
        `Profile for accountId : ${accountId} already exist`,
      );
    }

    const createProfile = await this.profileModel.create({
      accountId,
      ...profile,
    });

    return new FormatResponse<Profile>(
      'Create profile success',
      createProfile.toJSON(),
    );
  }

  async updateProfile(
    payload: FormatRpcRequest<UpdateProfileDto>,
  ): ProfileResponseType {
    const { accountId } = payload.params;
    const newProfile = payload.data;

    await this._findProfile(accountId);

    const updateProfile = await this.profileModel
      .findOneAndUpdate({ accountId }, newProfile, { new: true })
      .select('-createdAt -updatedAt');

    return new FormatResponse<Profile>(
      'Update profile success',
      updateProfile.toJSON(),
    );
  }

  private async _findProfile(accountId: string) {
    const profile = await this.profileModel.findOne({
      accountId,
    });

    if (!profile) {
      throw new BadRequestException(
        'Profile not found. Please create profile first',
      );
    }

    return profile;
  }
}
