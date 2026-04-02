import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ServicePort } from '../../domain/ports/service.port';
import { ProductDto } from './mulesoft.dto';

@Controller('v1')
export class MulesoftController {
  constructor(private readonly service: ServicePort) {}

  @Get('/products')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async get(@Query() dto: ProductDto) {
    return this.service.get(dto);
  }
}
