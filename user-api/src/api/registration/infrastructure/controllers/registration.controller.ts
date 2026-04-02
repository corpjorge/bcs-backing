import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { ServicePort } from '../../domain/ports/service.port';
import { RegistrationDto } from './registration.dto';
import { MetricsService } from '../../../../commons/metrics.service';


@Controller('v1')
export class RegistrationController {
  constructor(
    private readonly service: ServicePort,
    private readonly metricsService: MetricsService,
  ) {}

  @Post('/registration')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  async create(
    @Body() registrationDto: RegistrationDto,
  ): Promise<{ message: string }> {
    this.metricsService.increment('controller.metric');
    return this.service.create(registrationDto);
  }
}
