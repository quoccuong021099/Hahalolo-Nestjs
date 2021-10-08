import {
  Module,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService, UserService2 } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UserService2],
})
export class UserModule implements OnApplicationShutdown {
  onApplicationShutdown(sigal: string) {
    console.log(`The application{UserModule} has been destroyed.`);
  }
}

// import { Module, OnModuleDestroy } from '@nestjs/common';

export class UserModule2 implements OnModuleDestroy {
  async onModuleDestroy() {
    console.log(`The UserModule2 has been destroyed.`);
  }
}
