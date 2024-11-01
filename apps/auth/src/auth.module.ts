import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule, getLocalEnv } from '@app/common';
import * as Joi from 'joi';
import { MongooseModule } from '@nestjs/mongoose';

const env = getLocalEnv('auth');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required().default(3001),
        MONGODB_URI: Joi.string().required(),
      }),
      envFilePath: env,
    }),
    DatabaseModule,
    MongooseModule.forFeature([
      // {
      //   name: Auth.name,
      //   schema: AuthSchema,
      // },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
