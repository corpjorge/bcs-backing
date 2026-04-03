import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';


export class CryptoService {
  private readonly key: Buffer;

  constructor() {
    this.key = this.loadKey();
  }

  private loadKey(): Buffer {
    const encodedKey = process.env.APPENCKEY;

    if (!encodedKey) {
      throw new Error(
        'Missing APPENCKEY environment variable. Provide a base64-encoded 32-byte key.',
      );
    }

    const key = Buffer.from(encodedKey, 'base64');

    if (key.length !== 32) {
      throw new Error(
        'Invalid APPENCKEY. It must be a base64-encoded 32-byte key.',
      );
    }

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

      return {
        iv: iv.toString('base64'),
        tag: tag.toString('base64'),
        data: encrypted.toString('base64'),
      };
    } catch (error) {
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

      return JSON.parse(decrypted.toString('utf8')) as unknown;
    } catch (error) {
      throw error;
    }
  }
}
