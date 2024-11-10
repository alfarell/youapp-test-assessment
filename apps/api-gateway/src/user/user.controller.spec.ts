import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {
  CLIENTS_NAME,
  CreateProfileDto,
  FormatRpcRequest,
  UpdateProfileDto,
  USER_PATTERNS,
} from '@app/common';
import { MockClientProxy, MockRequest } from '@app/test';
import { APP_PIPE, REQUEST } from '@nestjs/core';
import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';

const mockHeaders = { accountId: 'account-id-123' };
const mockUserData = {
  id: 'user-123',
  name: 'test',
  birthday: '2000-11-10T10:17:01.521Z',
  gender: 'male',
  height: 160,
  weight: 60,
};

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: CLIENTS_NAME.USER_SERVICE,
          useValue: MockClientProxy,
        },
        {
          provide: REQUEST,
          useValue: new MockRequest<{ accountId: string }>({
            headers: mockHeaders,
          }),
        },
        {
          provide: APP_PIPE,
          useClass: ValidationPipe,
        },
      ],
    }).compile();

    controller = await module.resolve<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return user profile', () => {
    const mockPayload = new FormatRpcRequest({
      params: mockHeaders,
    });
    const mockRes = mockUserData;
    const mockFn = jest
      .spyOn(MockClientProxy, 'send')
      .mockReturnValueOnce(mockRes);
    const res = controller.getOne();

    expect(mockFn).toHaveBeenCalledWith(USER_PATTERNS.GET_PROFILE, mockPayload);
    expect(res).toEqual(mockRes);
  });

  it('should return user created profile', () => {
    const mockPayload = new FormatRpcRequest<CreateProfileDto>({
      params: mockHeaders,
      data: mockUserData,
    });
    const mockRes = mockUserData;
    const mockFn = jest
      .spyOn(MockClientProxy, 'send')
      .mockReturnValueOnce(mockRes);
    const res = controller.create(mockUserData);

    expect(mockFn).toHaveBeenCalledWith(
      USER_PATTERNS.CREATE_PROFILE,
      mockPayload,
    );
    expect(res).toEqual(mockRes);
  });

  it('should return user updated profile', () => {
    const editProfile = {
      name: 'edited',
    };
    const mockPayload = new FormatRpcRequest<UpdateProfileDto>({
      params: mockHeaders,
      data: editProfile,
    });
    const mockRes = { ...mockUserData, name: editProfile.name };
    const mockFn = jest
      .spyOn(MockClientProxy, 'send')
      .mockReturnValueOnce(mockRes);
    const res = controller.update(editProfile);

    expect(mockFn).toHaveBeenCalledWith(
      USER_PATTERNS.UPDATE_PROFILE,
      mockPayload,
    );
    expect(res).toEqual(mockRes);
  });

  it('should have return the payload CreateProfileDto if the format is valid', async () => {
    const target: ValidationPipe = new ValidationPipe({
      transform: true,
      whitelist: true,
    });
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: CreateProfileDto,
      data: '',
    };
    const payload = {
      name: 'test',
      birthday: '2000-11-10T10:17:01.521Z',
      gender: 'male',
      height: 160,
      weight: 60,
    };
    const validPayload = await target.transform(payload, metadata);

    expect(validPayload).toEqual(payload);
    expect(validPayload).toBeInstanceOf(CreateProfileDto);
  });

  it('should have error when payload is not valid CreateProfileDto', async () => {
    const target: ValidationPipe = new ValidationPipe({
      transform: true,
      whitelist: true,
    });
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: CreateProfileDto,
      data: '',
    };

    try {
      await target.transform(<CreateProfileDto>{}, metadata);
    } catch (err) {
      expect(err.getResponse().message).toEqual([
        'name must be shorter than or equal to 100 characters',
        'name must be a string',
        'name should not be empty',
        'gender must be one of the following values: male, female, others',
        'gender must be a string',
        'gender should not be empty',
        'birthday must be a string',
        'birthday should not be empty',
        'birthday must be a valid ISO 8601 date string',
        'height must be a number conforming to the specified constraints',
        'height should not be empty',
        'weight must be a number conforming to the specified constraints',
        'weight should not be empty',
      ]);
    }
  });

  it('should have error when payload is not valid SendMessageDto', async () => {
    const target: ValidationPipe = new ValidationPipe({
      transform: true,
      whitelist: true,
    });
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: UpdateProfileDto,
      data: '',
    };

    try {
      await target.transform(<UpdateProfileDto>{}, metadata);
    } catch (err) {
      expect(err.getResponse().message).toEqual([]);
    }
  });
});
