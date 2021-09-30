import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { loggerMiddleware } from './middlewares/logger.middleware';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { InfoController } from './info/info.controller';
import { InfoModule } from './info/info.module';
import { DemoClassMiddeWare } from './middlewares/class.middleware';
import { InfoService } from './info/info.service';
import { UsersService } from './users/users.service';

const mockInfoService = { ageDemo: 10 };

// const configServiceProvider = {
//   provide: ConfigServide,
//   useClass: process.env.NODE_ENV === 'info' ? InfoService : UsersService,
// };

@Module({
  imports: [UsersModule, InfoModule],
  controllers: [AppController, UsersController, InfoController],
  // providers: [AppService],
  providers: [
    {
      provide: AppService,
      // provide: 'CONNECTION',
      useValue: mockInfoService,
      useClass: InfoService,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(loggerMiddleware, DemoClassMiddeWare)
      .exclude({
        path: 'users',
        method: RequestMethod.GET,
      })
      // .forRoutes(UsersController);
      .forRoutes({ path: 'users', method: RequestMethod.POST });
  }
}
