import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const config = app.get(ConfigService);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      port: config.get('PORT'),
    },
  });
  await app.startAllMicroservices();
  await app.listen(config.get('PORT'));
  console.log('server running on PORT:', config.get('PORT'));
}
bootstrap();
