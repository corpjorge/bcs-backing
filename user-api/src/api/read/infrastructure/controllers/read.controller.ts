import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ServicePort } from '../../domain/ports/service.port';
import { ReadDto } from './read.dto';

@Controller('v1')
export class ReadController {
  constructor(private readonly service: ServicePort) {}

  @Post('/read')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async read(@Body() dto: ReadDto) {
    return this.service.read(dto);
  }
}
