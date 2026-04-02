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
import { ProductDto } from './registration.dto';

@Controller('v1')
export class RegistrationController {
  constructor(private readonly service: ServicePort) {}

  @Post('/registration')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@Body() dto: ProductDto) {
    return this.service.create(dto);
  }
}
