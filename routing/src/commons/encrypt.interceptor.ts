import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map } from 'rxjs/operators';
import { CryptoService } from './encrypt';
import { SKIP_ENCRYPTION_KEY } from './skip-encryption.decorator';

@Injectable()
export class EncryptInterceptor implements NestInterceptor {
  constructor(
    private crypto: CryptoService,
    private reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const shouldSkip = this.reflector.getAllAndOverride<boolean>(
      SKIP_ENCRYPTION_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (shouldSkip) {
      return next.handle();
    }

    return next.handle().pipe(map((data) => this.crypto.encrypt(data)));
  }
}
