import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { getLocalEnv, CLIENTS_NAME, AuthGuard } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

const env = getLocalEnv('api-gateway');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        AUTH_SERVICE_PORT: Joi.string().required(),
        USER_SERVICE_PORT: Joi.string().required(),
        ACCESS_TOKEN_SECRET: Joi.string().required(),
        ACCESS_TOKEN_EXPIRES: Joi.number().required(),
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_MESSAGE_QUEUE: Joi.string().required(),
      }),
      envFilePath: env,
    }),
    ClientsModule.registerAsync({
      isGlobal: true,
      clients: [
        {
          name: CLIENTS_NAME.AUTH_SERVIC,
          useFactory: (configService: ConfigService) => ({
            transport: Transport.TCP,
            options: {
              port: configService.get('AUTH_SERVICE_PORT'),
            },
          }),
          inject: [ConfigService],
        },
        {
          name: CLIENTS_NAME.USER_SERVICE,
          useFactory: (configService: ConfigService) => ({
            transport: Transport.TCP,
            options: {
              port: configService.get('USER_SERVICE_PORT'),
            },
          }),
          inject: [ConfigService],
        },
        {
          name: CLIENTS_NAME.MESSAGE_RMQ_SERVICE,
          useFactory: (configService: ConfigService) => ({
            transport: Transport.RMQ,
            options: {
              urls: configService.get('RABBIT_MQ_URI'),
              queue: configService.get('RABBIT_MQ_MESSAGE_QUEUE'),
            },
          }),
          inject: [ConfigService],
        },
      ],
    }),
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
    UserModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class ApiGatewayModule {}
