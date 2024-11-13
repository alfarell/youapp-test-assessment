import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  CLIENTS_NAME,
  CustomRpcExceptionFilter,
  DatabaseModule,
  MongoExceptionFilter,
} from '@app/common';
import {
  Conversation,
  ConversationSchema,
  Message,
  MessageSchema,
} from './schema';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RmqService } from '@app/common/rabbitmq/rabbitmq.service';
import { APP_FILTER } from '@nestjs/core';

// const env = getLocalEnv('message');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        USER_SERVICE_HOST: Joi.string().required(),
        USER_SERVICE_PORT: Joi.number().required(),
        MESSAGE_MONGODB_URI: Joi.string().required(),
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_SEND_MESSAGE_QUEUE: Joi.string().required(),
        RABBIT_MQ_VIEW_MESSAGE_QUEUE: Joi.string().required(),
      }),
      // envFilePath: env,
    }),
    ClientsModule.registerAsync({
      isGlobal: true,
      clients: [
        {
          name: CLIENTS_NAME.USER_SERVICE,
          useFactory: (configService: ConfigService) => ({
            transport: Transport.TCP,
            options: {
              host: configService.get('USER_SERVICE_HOST'),
              port: configService.get('USER_SERVICE_PORT'),
            },
          }),
          inject: [ConfigService],
        },
      ],
    }),
    DatabaseModule.register('MESSAGE'),
    MongooseModule.forFeature([
      {
        name: Message.name,
        schema: MessageSchema,
      },
      {
        name: Conversation.name,
        schema: ConversationSchema,
      },
    ]),
  ],
  controllers: [MessageController],
  providers: [
    MessageService,
    RmqService,
    { provide: APP_FILTER, useClass: CustomRpcExceptionFilter },
    { provide: APP_FILTER, useClass: MongoExceptionFilter },
  ],
})
export class MessageModule {}
