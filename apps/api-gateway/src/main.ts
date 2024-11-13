import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { ConfigService } from '@nestjs/config';
import { HttpCatchFilter } from '@app/common';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  app.setGlobalPrefix('api');

  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HttpCatchFilter(httpAdapter));
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  const docsConfig = new DocumentBuilder()
    .setTitle('Messaging App')
    .setDescription(
      'Messaging app project with nestjs microservices and rabbit mq.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'Bearer',
        bearerFormat: 'Bearer',
        in: 'header',
      },
      'accessToken',
    )
    .addSecurityRequirements('accessToken')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, docsConfig);
  SwaggerModule.setup('docs', app, documentFactory);

  const config = app.get(ConfigService);
  await app.listen(config.get('API_GATEWAY_PORT'));
  console.log('server running on PORT:', config.get('API_GATEWAY_PORT'));
}
bootstrap();
