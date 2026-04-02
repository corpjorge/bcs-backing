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
import { ProductDto } from './read.dto';

@Controller('v1')
export class ReadController {
  constructor(private readonly service: ServicePort) {}

  @Get('/read')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async read(@Query() dto: ProductDto) {
    return this.service.read(dto);
  }
}
