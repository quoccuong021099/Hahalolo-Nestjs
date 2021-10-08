import {
  Injectable,
  OnApplicationBootstrap,
  OnModuleInit,
} from '@nestjs/common';

@Injectable()
export class UserService2 implements OnModuleInit {
  onModuleInit() {
    console.log(`The UserService2 has been bootstraped.`);
  }
}
@Injectable()
export class UserService implements OnApplicationBootstrap {
  onApplicationBootstrap() {
    console.log(`The application{UserService} has been bootstraped.`);
  }
  getAll() {
    return 'Get all method';
  }
}
