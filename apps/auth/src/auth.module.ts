import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import {
  CustomRpcExceptionFilter,
  DatabaseModule,
  MongoExceptionFilter,
} from '@app/common';
import * as Joi from 'joi';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema, Session, SessionSchema } from './schema';
import { APP_FILTER } from '@nestjs/core';

// const env = getLocalEnv('auth');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        AUTH_SERVICE_PORT: Joi.number().required().default(3001),
        AUTH_SERVICE_HOST: Joi.string().required(),
        AUTH_MONGODB_URI: Joi.string().required(),
        ACCESS_TOKEN_SECRET: Joi.string().required(),
        ACCESS_TOKEN_EXPIRES: Joi.number().required(),
      }),
      // envFilePath: env,
    }),
    DatabaseModule.register('AUTH'),
    MongooseModule.forFeature([
      {
        name: Account.name,
        schema: AccountSchema,
      },
      {
        name: Session.name,
        schema: SessionSchema,
      },
    ]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: configService.get<number>('ACCESS_TOKEN_EXPIRES'),
          algorithm: 'HS512',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    { provide: APP_FILTER, useClass: CustomRpcExceptionFilter },
    { provide: APP_FILTER, useClass: MongoExceptionFilter },
  ],
})
export class AuthModule {}
