import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as cacheManager from 'cache-manager';
import { Reflector } from '@nestjs/core';

@Injectable()
export class CacheManagerInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  manager = cacheManager.caching({ store: 'memory', max: 1, ttl: 10 });
  // max: số lượng tối đa các mục trong bộ nhớ cache
  // ttl: thời gian sống của cache
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const key = this.reflector.get('cache-key', context.getHandler());

    const cached = await this.manager.get(key);

    if (cached) return cached;

    return next
      .handle()
      .pipe(tap((response) => this.manager.set(key, response)));
  }
}
