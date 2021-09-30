import { Module } from '@nestjs/common';
import { InfoController } from './info.controller';
import { InfoService } from './info.service';

@Module({
  providers: [InfoService],
  controllers: [InfoController],
  exports: [InfoService],
})
export class InfoModule {}
