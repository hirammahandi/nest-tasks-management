import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiModule } from './api/api.module';
import { TypeOrmConfigService } from './config';

/* 
  *@note  Use pipe of this way allow to use dependency injection through the inject property
    ex: provider: ->  {
      provide: APP_PIPE,
      useClass: ValidationPipe,
      inject: ["INJECTION_KEY"]
    },

    *@note the modules with prop `forAsyncRoot` can be used to use an custom service with the prop `useClass`, the serve must implement the interface related with factory.
    ex: class SomeConfigService implements  SomeOptionsFactory
*/

@Module({
  imports: [
    ApiModule,
    // *@note Way to use the config services to get the env variables trough of the project
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // *@note Way to use the typeorm config service in the typeorm module
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
  ],
})
export class AppModule {}
