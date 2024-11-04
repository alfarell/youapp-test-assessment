import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule, getLocalEnv } from '@app/common';
import * as Joi from 'joi';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from './schema';

const env = getLocalEnv('user');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required().default(3002),
        MONGODB_URI: Joi.string().required(),
      }),
      envFilePath: env,
    }),
    DatabaseModule,
    MongooseModule.forFeature([
      {
        name: Profile.name,
        schema: ProfileSchema,
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
