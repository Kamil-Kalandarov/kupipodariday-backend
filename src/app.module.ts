import { Module, CacheModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as Joi from 'joi';
import type { ClientOpts } from 'redis';
import redisStore from 'cache-manager-redis-store';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { AppService } from './app.service';
import configuration from './configuration';

const shcema = Joi.object({
  port: Joi.number().integer().default(3000),
  database: Joi.object({
    host: Joi.string()
      .pattern(/postgres:\/\/[a-zA-Z]/)
      .required(),
    port: Joi.number().integer().required(),
    username: Joi.string(),
    password: Joi.string(),
  }),
});

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      validationSchema: shcema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: AppService,
    }),
    CacheModule.registerAsync<ClientOpts>({
      useFactory: async () => {
        return {
          store: redisStore,
          host: 'localhost',
          port: 6379,
        };
      },
    }),
    WinstonModule.forRoot({
      levels: {
        critical_error: 0,
        error: 1,
        special_warning: 2,
        another_log_level: 3,
        info: 4,
      },
      transports: [
        new winston.transports.Console({ format: winston.format.simple() }),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
      ],
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
