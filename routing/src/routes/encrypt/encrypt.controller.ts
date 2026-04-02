import { Body, Controller, Post } from '@nestjs/common';
import { CryptoService } from '../../commons/encrypt';
import { SkipEncryption } from '../../commons/skip-encryption.decorator';

type EncryptedPayload = {
  iv: string;
  tag: string;
  data: string;
};

@Controller()
export class EncryptController {
  constructor(private readonly crypto: CryptoService) {}

  @Post('/encrypt')
  encryptBody(@Body() data: unknown) {
    return data;
  }

  @SkipEncryption()
  @Post('/decrypt')
  decryptBody(@Body() payload: EncryptedPayload): unknown {
    return this.crypto.decrypt(payload);
  }
}
