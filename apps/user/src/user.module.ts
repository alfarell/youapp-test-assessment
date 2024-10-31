import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ConfigModule } from '@nestjs/config';
import { getLocalEnv } from '@app/common';
import * as Joi from 'joi';

const env = getLocalEnv('user');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required().default(3002),
      }),
      envFilePath: env,
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
