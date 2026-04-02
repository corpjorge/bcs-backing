import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UserApiService } from './user-api.service';
import { UserApiController } from './user-api.controller';

@Module({
  imports: [HttpModule],
  providers: [UserApiService],
  controllers: [UserApiController],
})
export class UserApiModule {}
