import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CryptoService } from './encrypt';

type EncryptedPayload = {
  iv: string;
  tag: string;
  data: string;
};

function isEncryptedPayload(body: unknown): body is EncryptedPayload {
  if (!body || typeof body !== 'object') {
    return false;
  }

  const candidate = body as Record<string, unknown>;

  return (
    typeof candidate.iv === 'string' &&
    typeof candidate.tag === 'string' &&
    typeof candidate.data === 'string'
  );
}

function hasNonEmptyBody(body: unknown): boolean {
  if (body === null || body === undefined) {
    return false;
  }

  if (typeof body === 'object') {
    return Object.keys(body as Record<string, unknown>).length > 0;
  }

  return true;
}

@Injectable()
export class DecryptMiddleware implements NestMiddleware {
  constructor(private crypto: CryptoService) {}

  use(req: Request<any, any, unknown>, _res: Response, next: NextFunction) {
    if (!hasNonEmptyBody(req.body)) {
      next();
      return;
    }

    if (!isEncryptedPayload(req.body)) {
      throw new BadRequestException(
        'Request body must be encrypted and include iv, tag and data.',
      );
    }

    req.body = this.crypto.decrypt(req.body);
    next();
  }
}
