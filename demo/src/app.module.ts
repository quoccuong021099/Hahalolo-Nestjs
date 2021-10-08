import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InterceptModule } from './intercept/intercept.module';
import { LoggerMiddleware } from './logger.middleware';
import { UserModule, UserModule2 } from './user/user.module';

@Module({
  imports: [UserModule, UserModule2, InterceptModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: 'cats', method: RequestMethod.GET });
  }
}
