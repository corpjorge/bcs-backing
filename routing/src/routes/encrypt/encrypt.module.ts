import { Module } from '@nestjs/common';
import { CryptoService } from '../../commons/encrypt';
import { EncryptController } from './encrypt.controller';

@Module({
  controllers: [EncryptController],
  providers: [CryptoService],
  exports: [CryptoService],
})
export class EncryptModule {}
