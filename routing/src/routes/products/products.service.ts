import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError, AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { logs } from '@opentelemetry/api-logs';

@Injectable()
export class ProductsService {
  private readonly logger = logs.getLogger('products-service');

  constructor(private readonly httpService: HttpService) {}

  async getProducts(
    query: Record<string, string | number | boolean>,
  ): Promise<unknown> {
    const url = `${this.getBaseUrl()}/v1/products`;
    try {
      const result = await this.getRequest<unknown>(url, query);
      this.logger.emit({
        severityText: 'INFO',
        body: 'products retrieved',
        attributes: {
          endpoint: '/v1/products',
        },
      });
      return result;
    } catch (error) {
      this.logger.emit({
        severityText: 'ERROR',
        body: 'products retrieval failed',
        attributes: {
          endpoint: '/v1/products',
          error: error instanceof Error ? error.message : String(error),
        },
      });
      throw error;
    }
  }

  async readProducts(
    query: Record<string, string | number | boolean>,
  ): Promise<unknown> {
    const url = `${this.getBaseUrl()}/v1/read`;
    try {
      const result = await this.getRequest<unknown>(url, query);
      this.logger.emit({
        severityText: 'INFO',
        body: 'products read processed',
        attributes: {
          endpoint: '/v1/read',
        },
      });
      return result;
    } catch (error) {
      this.logger.emit({
        severityText: 'ERROR',
        body: 'products read failed',
        attributes: {
          endpoint: '/v1/read',
          error: error instanceof Error ? error.message : String(error),
        },
      });
      throw error;
    }
  }

  async createProduct(data: unknown): Promise<unknown> {
    const url = `${this.getBaseUrl()}/v1/registration`;
    try {
      const result = await this.postRequest<unknown>(url, data);
      this.logger.emit({
        severityText: 'INFO',
        body: 'product registered',
        attributes: {
          endpoint: '/v1/registration',
        },
      });
      return result;
    } catch (error) {
      this.logger.emit({
        severityText: 'ERROR',
        body: 'product registration failed',
        attributes: {
          endpoint: '/v1/registration',
          error: error instanceof Error ? error.message : String(error),
        },
      });
      throw error;
    }
  }

  async deleteProduct(id: string): Promise<unknown> {
    const url = `${this.getBaseUrl()}/v1/delete/${id}`;
    try {
      const result = await this.deleteRequest<unknown>(url);
      this.logger.emit({
        severityText: 'INFO',
        body: 'product deleted',
        attributes: {
          endpoint: '/v1/delete/:id',
          productId: id,
        },
      });
      return result;
    } catch (error) {
      this.logger.emit({
        severityText: 'ERROR',
        body: 'product deletion failed',
        attributes: {
          endpoint: '/v1/delete/:id',
          productId: id,
          error: error instanceof Error ? error.message : String(error),
        },
      });
      throw error;
    }
  }

  private getBaseUrl(): string {
    const urlProductApi = process.env.URLPRODUCTAPI;

    if (!urlProductApi) {
      this.logger.emit({
        severityText: 'ERROR',
        body: 'Missing URLPRODUCTAPI environment variable',
        attributes: {},
      });
      throw new Error('Missing URLPRODUCTAPI environment variable.');
    }

    return `http://${urlProductApi}`;
  }

  private getRequest<T>(
    url: string,
    query: Record<string, string | number | boolean>,
  ): Promise<T> {
    return firstValueFrom(
      this.httpService
        .get<T>(url, { params: query })
        .pipe(map((response: AxiosResponse<T>) => response.data)),
    ).catch((error: unknown) => {
      if (error instanceof AxiosError && error.response) {
        return error.response.data as T;
      }

      throw error;
    });
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

  private deleteRequest<T>(url: string): Promise<T> {
    return firstValueFrom(
      this.httpService
        .delete<T>(url)
        .pipe(map((response: AxiosResponse<T>) => response.data)),
    ).catch((error: unknown) => {
      if (error instanceof AxiosError && error.response) {
        return error.response.data as T;
      }

      throw error;
    });
  }
}

