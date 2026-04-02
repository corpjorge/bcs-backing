import { Body, Controller, Post } from '@nestjs/common';
import { CryptoService } from '../../commons/encrypt';
import { SkipEncryption } from '../../commons/skip-encryption.decorator';
import { MetricsService } from '../../commons/metrics.service';

type EncryptedPayload = {
  iv: string;
  tag: string;
  data: string;
};

@Controller()
export class EncryptController {
  constructor(
    private readonly crypto: CryptoService,
    private readonly metricsService: MetricsService,
  ) {}

  @Post('/encrypt')
  encryptBody(@Body() data: unknown) {
    this.metricsService.increment('controller.metric');
    return data;
  }

  @SkipEncryption()
  @Post('/decrypt')
  decryptBody(@Body() payload: EncryptedPayload): unknown {
    this.metricsService.increment('controller.metric');
    return this.crypto.decrypt(payload);
  }
}
