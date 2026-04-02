import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { AxiosError, AxiosResponse } from 'axios';
import { logs } from '@opentelemetry/api-logs';

@Injectable()
export class UserApiService {
  private readonly logger = logs.getLogger('user-api-service');

  constructor(private readonly httpService: HttpService) {}

  async sendUserData(data: unknown): Promise<unknown> {
    const urlUserApi = process.env.URLUSERAPI;

    if (!urlUserApi) {
      this.logger.emit({
        severityText: 'ERROR',
        body: 'Missing URLUSERAPI environment variable',
        attributes: {},
      });
      throw new Error('Missing URLUSERAPI environment variable.');
    }

    const url = `http://${urlUserApi}/v1/registration`;
    try {
      const result = await this.postRequest<unknown>(url, data);
      this.logger.emit({
        severityText: 'INFO',
        body: 'user registration processed',
        attributes: {
          endpoint: '/v1/registration',
        },
      });
      return result;
    } catch (error) {
      this.logger.emit({
        severityText: 'ERROR',
        body: 'user registration failed',
        attributes: {
          endpoint: '/v1/registration',
          error: error instanceof Error ? error.message : String(error),
        },
      });
      throw error;
    }
  }

  async readUserData(data: unknown): Promise<unknown> {
    const urlUserApi = process.env.URLUSERAPI;

    if (!urlUserApi) {
      this.logger.emit({
        severityText: 'ERROR',
        body: 'Missing URLUSERAPI environment variable',
        attributes: {},
      });
      throw new Error('Missing URLUSERAPI environment variable.');
    }

    const url = `http://${urlUserApi}/v1/read`;
    try {
      const result = await this.postRequest<unknown>(url, data);
      this.logger.emit({
        severityText: 'INFO',
        body: 'user read processed',
        attributes: {
          endpoint: '/v1/read',
        },
      });
      return result;
    } catch (error) {
      this.logger.emit({
        severityText: 'ERROR',
        body: 'user read failed',
        attributes: {
          endpoint: '/v1/read',
          error: error instanceof Error ? error.message : String(error),
        },
      });
      throw error;
    }
  }

  private postRequest<T>(url: string, data: unknown): Promise<T> {
    return firstValueFrom(
      this.httpService
        .post<T>(url, data, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .pipe(map((response: AxiosResponse<T>) => response.data)),
    ).catch((error: unknown) => {
      if (error instanceof AxiosError && error.response) {
        return error.response.data as T;
      }

      throw error;
    });
  }
}
