import { Module } from '@nestjs/common';
import { InfoModule } from 'src/info/info.module';
import { InfoService } from 'src/info/info.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],

})
export class UsersModule {}
