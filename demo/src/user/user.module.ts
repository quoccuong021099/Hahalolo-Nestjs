import {
  Module,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule implements OnApplicationShutdown {
  onApplicationShutdown(sigal: string) {
    console.log(`The application has been détroyed.`);
  }
}
