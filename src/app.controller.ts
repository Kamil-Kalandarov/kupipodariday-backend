import { Controller, Get, CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  @Get()
  async getHello(): Promise<any> {
    const someValue = this.appService.getHello();
    await this.cache.get(someValue);
    if (someValue) {
      return {
        data: someValue,
        FromRedis: 'this is from Redis cache',
      };
    }
    const result = this.appService.getHello();
    await this.cache.set(result, { ttl: 1000 });
    return result;
  }
}
