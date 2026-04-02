import {Body, Controller, Post} from '@nestjs/common';
import {UserApiService} from './user-api.service';
import { MetricsService } from '../../commons/metrics.service';

@Controller('/users-api/v1/')
export class UserApiController {
  constructor(
    private readonly service: UserApiService,
    private readonly metricsService: MetricsService,
  ) {}

  @Post('/registration')
  async sendUserData(@Body() data: unknown): Promise<unknown> {
    this.metricsService.increment('controller.metric');
    return await this.service.sendUserData(data);
  }

  @Post('/read')
  async readUserData(@Body() data: unknown): Promise<unknown> {
    this.metricsService.increment('controller.metric');
    return await this.service.readUserData(data);
  }
}
