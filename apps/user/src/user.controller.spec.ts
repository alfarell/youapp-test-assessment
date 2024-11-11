import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import {
  CreateProfileDto,
  CustomRpcExceptionFilter,
  FormatResponse,
  FormatRpcRequest,
  MongoExceptionFilter,
  UpdateProfileDto,
} from '@app/common';
import { getModelToken } from '@nestjs/mongoose';
import { Profile } from './schema';
import { Model, Query } from 'mongoose';

const mockUserProfile1 = {
  _id: '123-abc',
  accountId: 'abc-123',
  name: 'Test 1',
  gender: 'male',
  birthday: '2000-11-02T13:22:59.416Z',
  height: 160,
  weight: 64,
  horoscope: 'Scorpius',
  zodiac: 'Scorpion',
};
const mockUserProfile2 = {
  _id: '456-def',
  accountId: 'def-456',
  name: 'Test 2',
  gender: 'male',
  birthday: '2000-11-02T13:22:59.416Z',
  height: 160,
  weight: 64,
  horoscope: 'Scorpius',
  zodiac: 'Scorpion',
};

const GetProfileInstance = FormatResponse<Profile>;
const GetProfilesInstance = FormatResponse<Profile[]>;
const CreateProfileInstance = FormatResponse<Profile>;
const UpdateProfileInstance = FormatResponse<Profile>;

describe('UserController', () => {
  let userController: UserController;
  let profileModel: Model<Profile>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        { provide: APP_FILTER, useClass: CustomRpcExceptionFilter },
        { provide: APP_FILTER, useClass: MongoExceptionFilter },
        {
          provide: APP_PIPE,
          useValue: ValidationPipe,
        },
        {
          provide: getModelToken(Profile.name),
          useValue: Model,
        },
      ],
    }).compile();

    userController = await app.resolve<UserController>(UserController);
    profileModel = app.get<Model<Profile>>(getModelToken(Profile.name));
  });

  describe('get profile', () => {
    it('should return profile data', async () => {
      const payload = new FormatRpcRequest({
        params: {
          accountId: 'abc-123',
        },
      });
      const mockRes = mockUserProfile1;

      jest.spyOn(profileModel, 'findOne').mockReturnValue({
        toJSON: jest.fn().mockReturnValueOnce(mockRes),
      } as unknown as Query<Profile, any>);

      const req = await userController.getProfile(payload);

      expect(req).toBeInstanceOf(GetProfileInstance);
      expect(req.data).toEqual(mockRes);
      expect(req.data).not.toHaveProperty('createdAt');
      expect(req.data).not.toHaveProperty('updatedAt');
      expect(req.message).toEqual('Get profile success');
    });

    it('should throw error when profile not found', async () => {
      const payload = new FormatRpcRequest({
        params: {
          accountId: 'abc-123',
        },
      });

      jest.spyOn(profileModel, 'findOne').mockResolvedValueOnce(null);

      try {
        await userController.getProfile(payload);
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toEqual(
          'Profile not found. Please create profile first',
        );
      }
    });
  });

  describe('get profiles', () => {
    it('should return profiles data', async () => {
      const payload = new FormatRpcRequest<any, { profileIds: string[] }>({
        params: {
          profileIds: ['abc-123', 'def-456'],
        },
      });
      const mockRes = [mockUserProfile1, mockUserProfile2];

      jest.spyOn(profileModel, 'find').mockReturnValueOnce({
        select: jest.fn().mockResolvedValueOnce(mockRes),
      } as unknown as Query<Profile[], any>);

      const req = await userController.getProfiles(payload);

      expect(req).toBeInstanceOf(GetProfilesInstance);
      expect(req.data).toHaveLength(mockRes.length);
      expect(req.data).toEqual(mockRes);
      expect(req.message).toEqual('Get profile success');
    });

    it('should return empty array when profiles not found', async () => {
      const payload = new FormatRpcRequest({
        params: {
          profileIds: ['abc-123', 'def-456'],
        },
      });

      jest.spyOn(profileModel, 'find').mockReturnValueOnce({
        select: jest.fn().mockResolvedValueOnce([]),
      } as unknown as Query<Profile[], any>);

      const req = await userController.getProfiles(payload);

      expect(req).toBeInstanceOf(GetProfilesInstance);
      expect(req.data).toHaveLength(0);
      expect(req.data).toEqual([]);
      expect(req.message).toEqual('Get profile success');
    });
  });

  describe('create profile', () => {
    it('should return profile data when success create profile', async () => {
      const payload = new FormatRpcRequest<CreateProfileDto>({
        params: {
          accountId: 'abc-123',
        },
        data: {
          name: mockUserProfile1.name,
          birthday: mockUserProfile1.birthday,
          gender: mockUserProfile1.gender,
          height: mockUserProfile1.height,
          weight: mockUserProfile1.weight,
        },
      });
      const mockRes = mockUserProfile1;

      jest.spyOn(profileModel, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(profileModel, 'create').mockImplementationOnce(
        jest.fn().mockResolvedValue({
          toJSON: jest.fn().mockReturnValue(mockRes),
        } as unknown as Query<Profile, any>),
      );

      const req = await userController.createProfile(payload);

      expect(req).toBeInstanceOf(CreateProfileInstance);
      expect(req.data).toEqual(mockRes);
      expect(req.data).not.toHaveProperty('createdAt');
      expect(req.data).not.toHaveProperty('updatedAt');
      expect(req.message).toEqual('Create profile success');
    });

    it('should throw error when account is already have profile', async () => {
      const payload = new FormatRpcRequest({
        params: {
          accountId: 'abc-123',
        },
        data: {
          name: mockUserProfile1.name,
          birthday: mockUserProfile1.birthday,
          gender: mockUserProfile1.gender,
          height: mockUserProfile1.height,
          weight: mockUserProfile1.weight,
        },
      });
      const mockRes = mockUserProfile1;

      jest.spyOn(profileModel, 'findOne').mockResolvedValueOnce(mockRes);

      try {
        await userController.createProfile(payload);
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toEqual(
          `Profile for accountId : ${payload.params.accountId} already exist`,
        );
      }
    });
  });

  describe('update profile', () => {
    it('should return profile data when success update profile', async () => {
      const payload = new FormatRpcRequest<UpdateProfileDto>({
        params: {
          accountId: 'abc-123',
        },
        data: {
          name: 'Test edit',
        },
      });
      const mockRes = mockUserProfile2;

      jest.spyOn(profileModel, 'findOne').mockResolvedValueOnce(mockRes);
      jest.spyOn(profileModel, 'findOneAndUpdate').mockReturnValueOnce({
        select: jest.fn().mockResolvedValueOnce({
          toJSON: jest.fn().mockReturnValue(mockRes),
        }),
      } as unknown as Query<Profile[], any>);

      const req = await userController.updateProfile(payload);

      expect(req).toBeInstanceOf(UpdateProfileInstance);
      expect(req.data).toEqual(mockRes);
      expect(req.data).not.toHaveProperty('createdAt');
      expect(req.data).not.toHaveProperty('updatedAt');
      expect(req.message).toEqual('Update profile success');
    });
  });
});
