import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MetricsService } from '../../../../commons/metrics.service';
import { ServicePort } from '../../domain/ports/service.port';
import { DeleteDto } from './delete.dto';

@Controller('v1')
export class DeleteController {
  constructor(
    private readonly service: ServicePort,
    private readonly metricsService: MetricsService,
  ) {}

  @Delete('/delete/:id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async delete(@Param() dto: DeleteDto) {
    this.metricsService.increment('controller.metric');
    return this.service.delete(dto);
  }
}
