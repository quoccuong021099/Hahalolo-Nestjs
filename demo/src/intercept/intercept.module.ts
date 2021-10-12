import { Module } from '@nestjs/common';
import { InterceptController } from './intercept.controller';
import { InterceptService } from './intercept.service';

@Module({
  controllers: [InterceptController],
  providers: [InterceptService],
})
export class InterceptModule {}
