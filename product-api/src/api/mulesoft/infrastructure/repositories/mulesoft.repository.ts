import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { logs } from '@opentelemetry/api-logs';

import { ProductModel } from '../../domain/models/mulesoft.model';
import { RepositoryPort } from '../../domain/ports/repository.port';

@Injectable()
export class MulesoftRepository implements RepositoryPort {
  private readonly logger = logs.getLogger('product-repository');

  constructor(private readonly configService: ConfigService) {}

  async get(data: ProductModel): Promise<{ message: string; data: any }> {
    const baseUrl = this.configService.get<string>('MULESOFT_CORE_URL');

    if (!baseUrl) {
      throw new InternalServerErrorException('Missing MULESOFT_CORE_URL');
    }

    const requestUrl = `${baseUrl}?user=${encodeURIComponent(data.user)}`;
    const response = await fetch(requestUrl, { method: 'GET' });

    if (!response.ok) {
      this.logger.emit({
        severityText: 'ERROR',
        body: 'mulesoft request failed',
        attributes: {
          user: data.user,
          statusCode: response.status,
        },
      });
      throw new BadGatewayException('Mulesoft service request failed');
    }

    const responseData = await response.json();

    this.logger.emit({
      severityText: 'INFO',
      body: 'product searched',
      attributes: {
        user: data.user,
      },
    });

    return { message: 'ok', data: responseData };
  }
}
