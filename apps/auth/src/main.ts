import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const config = app.get(ConfigService);
  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.TCP,
      options: {
        host: config.get('AUTH_SERVICE_HOST'),
        port: config.get('AUTH_SERVICE_PORT'),
      },
    },
    {
      inheritAppConfig: true,
    },
  );
  await app.startAllMicroservices();
  console.log('server running on PORT:', config.get('AUTH_SERVICE_PORT'));
}
bootstrap();
