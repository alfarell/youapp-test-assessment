import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({})
export class DatabaseModule {
  static register(name: string): DynamicModule {
    return {
      module: DatabaseModule,
      exports: [MongooseModule],
      imports: [
        MongooseModule.forRootAsync({
          useFactory: (configService: ConfigService) => ({
            uri: configService.get<string>(`${name}_MONGODB_URI`),
          }),
          inject: [ConfigService],
        }),
      ],
    };
  }
}
