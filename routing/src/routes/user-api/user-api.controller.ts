import {Body, Controller, Post} from '@nestjs/common';
import {UserApiService} from './user-api.service';

@Controller('/users-api/v1/')
export class UserApiController {
  constructor(private readonly service: UserApiService) {}

  @Post('/registration')
  async sendUserData(@Body() data: unknown): Promise<unknown> {
    return await this.service.sendUserData(data);
  }
}
