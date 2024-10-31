import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  app.setGlobalPrefix('api');
  const config = app.get(ConfigService);
  await app.listen(config.get('PORT') ?? 3000);
  console.log('server running on PORT:', config.get('PORT'));
}
bootstrap();
