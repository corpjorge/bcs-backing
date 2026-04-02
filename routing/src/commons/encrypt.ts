import { Injectable } from '@nestjs/common';
import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';
import { logs } from '@opentelemetry/api-logs';

@Injectable()
export class CryptoService {
  private readonly key: Buffer;
  private readonly logger = logs.getLogger('crypto-service');

  constructor() {
    this.key = this.loadKey();
  }

  private loadKey(): Buffer {
    const encodedKey = process.env.APPENCKEY;

    if (!encodedKey) {
      this.logger.emit({
        severityText: 'ERROR',
        body: 'Missing APPENCKEY environment variable',
        attributes: {},
      });
      throw new Error(
        'Missing APPENCKEY environment variable. Provide a base64-encoded 32-byte key.',
      );
    }

    const key = Buffer.from(encodedKey, 'base64');

    if (key.length !== 32) {
      this.logger.emit({
        severityText: 'ERROR',
        body: 'Invalid APPENCKEY length',
        attributes: { keyLength: key.length },
      });
      throw new Error(
        'Invalid APPENCKEY. It must be a base64-encoded 32-byte key.',
      );
    }

    this.logger.emit({
      severityText: 'INFO',
      body: 'crypto service initialized',
      attributes: {},
    });

    return key;
  }

  encrypt(data: unknown) {
    try {
      const iv = randomBytes(12);
      const cipher = createCipheriv('aes-256-gcm', this.key, iv);

      const json = JSON.stringify(data);
      const encrypted = Buffer.concat([
        cipher.update(json, 'utf8'),
        cipher.final(),
      ]);

      const tag = cipher.getAuthTag();

      this.logger.emit({
        severityText: 'INFO',
        body: 'data encrypted successfully',
        attributes: {
          method: 'encrypt',
        },
      });

      return {
        iv: iv.toString('base64'),
        tag: tag.toString('base64'),
        data: encrypted.toString('base64'),
      };
    } catch (error) {
      this.logger.emit({
        severityText: 'ERROR',
        body: 'encryption failed',
        attributes: {
          method: 'encrypt',
          error: error instanceof Error ? error.message : String(error),
        },
      });
      throw error;
    }
  }

  decrypt(payload: { iv: string; tag: string; data: string }): unknown {
    try {
      const decipher = createDecipheriv(
        'aes-256-gcm',
        this.key,
        Buffer.from(payload.iv, 'base64'),
      );

      decipher.setAuthTag(Buffer.from(payload.tag, 'base64'));

      const decrypted = Buffer.concat([
        decipher.update(Buffer.from(payload.data, 'base64')),
        decipher.final(),
      ]);

      this.logger.emit({
        severityText: 'INFO',
        body: 'data decrypted successfully',
        attributes: {
          method: 'decrypt',
        },
      });

      return JSON.parse(decrypted.toString('utf8')) as unknown;
    } catch (error) {
      this.logger.emit({
        severityText: 'ERROR',
        body: 'decryption failed',
        attributes: {
          method: 'decrypt',
          error: error instanceof Error ? error.message : String(error),
        },
      });
      throw error;
    }
  }
}
