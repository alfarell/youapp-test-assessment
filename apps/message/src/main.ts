import { NestFactory } from '@nestjs/core';
import { MessageModule } from './message.module';
import { RmqOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(MessageModule);
  const config = app.get(ConfigService);
  app.connectMicroservice<RmqOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [config.get<string>('RABBIT_MQ_URI')],
      queue: config.get<string>(`RABBIT_MQ_SEND_MESSAGE_QUEUE`),
      noAck: false,
      persistent: true,
    },
  });
  app.connectMicroservice<RmqOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [config.get<string>('RABBIT_MQ_URI')],
      queue: config.get<string>(`RABBIT_MQ_VIEW_MESSAGE_QUEUE`),
      noAck: true,
      persistent: true,
    },
  });
  await app.startAllMicroservices();
  await app.listen(config.get('PORT'));
  console.log('server listening to:', config.get('RABBIT_MQ_URI'));
}
bootstrap();
