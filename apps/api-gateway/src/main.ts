import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { ConfigService } from '@nestjs/config';
import { HttpCatchFilter } from '@app/common';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HttpCatchFilter(httpAdapter));
  app.useGlobalPipes(new ValidationPipe());

  const config = app.get(ConfigService);
  await app.listen(config.get('PORT') ?? 3000);
  console.log('server running on PORT:', config.get('PORT'));
}
bootstrap();
