import { Module } from '@nestjs/common';
import { CryptoService } from '../../commons/encrypt';
import { EncryptController } from './encrypt.controller';
import { MetricsModule } from '../../commons/metrics.module';

@Module({
  imports: [MetricsModule],
  controllers: [EncryptController],
  providers: [CryptoService],
  exports: [CryptoService],
})
export class EncryptModule {}
