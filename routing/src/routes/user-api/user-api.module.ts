import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UserApiService } from './user-api.service';
import { UserApiController } from './user-api.controller';
import { MetricsModule } from '../../commons/metrics.module';

@Module({
  imports: [HttpModule, MetricsModule],
  providers: [UserApiService],
  controllers: [UserApiController],
})
export class UserApiModule {}
