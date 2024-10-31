import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { getLocalEnv, CLIENTS_NAME } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

const env = getLocalEnv('api-gateway');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        AUTH_SERVICE_PORT: Joi.string().required(),
        USER_SERVICE_PORT: Joi.string().required(),
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
      ],
    }),
    UserModule,
    AuthModule,
  ],
})
export class ApiGatewayModule {}
