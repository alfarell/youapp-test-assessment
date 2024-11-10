import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import {
  CLIENTS_NAME,
  CreateProfileDto,
  FormatRpcRequest,
  UpdateProfileDto,
  USER_PATTERNS,
} from '@app/common';
import { REQUEST } from '@nestjs/core';
import { MockClientProxy, MockRequest } from '@app/test';

const mockHeaders = { accountId: 'account-id-123' };
const mockUserData = {
  id: 'user-123',
  name: 'test',
  birthday: '2000-11-10T10:17:01.521Z',
  gender: 'male',
  height: 160,
  weight: 60,
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
      ],
    }).compile();

    service = await module.resolve<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return user profile', () => {
    const mockPayload = new FormatRpcRequest({
      params: mockHeaders,
    });
    const mockRes = mockUserData;
    const mockFn = jest
      .spyOn(MockClientProxy, 'send')
      .mockReturnValueOnce(mockRes);
    const res = service.getOne();

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
    const res = service.create(mockUserData);

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
    const res = service.update(editProfile);

    expect(mockFn).toHaveBeenCalledWith(
      USER_PATTERNS.UPDATE_PROFILE,
      mockPayload,
    );
    expect(res).toEqual(mockRes);
  });
});
