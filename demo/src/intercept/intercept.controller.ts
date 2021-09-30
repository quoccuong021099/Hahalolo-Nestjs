import { CacheKey } from './cache-key.decorator';
import { InterceptService } from './intercept.service';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { CacheManagerInterceptor } from './cache-manager.interceptor';

@Controller('inter')
@UseInterceptors(CacheManagerInterceptor)
export class InterceptController {
  constructor(private interceptService: InterceptService) {}

  @Get()
  @CacheKey('greet_key')
  getHello() {
    return this.interceptService.getHello();
  }

  @Get('question')
  @CacheKey('question_key')
  getquestion() {
    return 'get questions';
  }
}
