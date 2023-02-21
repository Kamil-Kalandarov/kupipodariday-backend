import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class AppService implements TypeOrmOptionsFactory {
  constructor(
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  createTypeOrmOptions() {
    this.logger.log('debug', 'application stated');
    return this.configService.get('database');
  }
  getHello(): string {
    return 'Hello Nest.Js';
  }
}
