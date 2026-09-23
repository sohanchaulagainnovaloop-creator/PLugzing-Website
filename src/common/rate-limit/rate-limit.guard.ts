import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import {
  RATE_LIMIT_KEY,
  RateLimitOptions,
} from './rate-limit.decorator';

import { RedisService } from '../redis/redis.service';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const options = this.reflector.get<RateLimitOptions>(
      RATE_LIMIT_KEY,
      context.getHandler(),
    );

    // If @RateLimit() is not present,
    // allow the request normally.
    if (!options) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const ip = request.ip;

    const controllerName = context.getClass().name;
    const handlerName = context.getHandler().name;

    const key = `rate-limit:${controllerName}:${handlerName}:${ip}`;

    const currentCount = await this.redisService.get(key);

    const count = currentCount ? Number(currentCount) : 0;

    if (count >= options.limit) {
      throw new HttpException(
        'Too many requests. Please try again later.',
        429,
      );
    }

    await this.redisService.set(
      key,
      String(count + 1),
      options.windowSeconds,
    );

    return true;
  }
}
