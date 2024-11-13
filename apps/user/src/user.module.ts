import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ConfigModule } from '@nestjs/config';
import {
  CustomRpcExceptionFilter,
  DatabaseModule,
  MongoExceptionFilter,
} from '@app/common';
import * as Joi from 'joi';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from './schema';
import { APP_FILTER } from '@nestjs/core';

// const env = getLocalEnv('user');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        USER_SERVICE_PORT: Joi.number().required().default(3002),
        USER_SERVICE_HOST: Joi.string().required(),
        USER_MONGODB_URI: Joi.string().required(),
      }),
      // envFilePath: env,
    }),
    DatabaseModule.register('USER'),
    MongooseModule.forFeature([
      {
        name: Profile.name,
        schema: ProfileSchema,
      },
    ]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: APP_FILTER,
      useClass: CustomRpcExceptionFilter,
    },
    { provide: APP_FILTER, useClass: MongoExceptionFilter },
  ],
})
export class UserModule {}
