import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError, AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ProductsService {
  constructor(private readonly httpService: HttpService) {}

  async getProducts(
    query: Record<string, string | number | boolean>,
  ): Promise<unknown> {
    const url = `${this.getBaseUrl()}/v1/products`;
    return this.getRequest<unknown>(url, query);
  }

  async readProducts(
    query: Record<string, string | number | boolean>,
  ): Promise<unknown> {
    const url = `${this.getBaseUrl()}/v1/read`;
    return this.getRequest<unknown>(url, query);
  }

  async createProduct(data: unknown): Promise<unknown> {
    const url = `${this.getBaseUrl()}/v1/registration`;
    return this.postRequest<unknown>(url, data);
  }

  private getBaseUrl(): string {
    const urlProductApi = process.env.URLPRODUCTAPI;

    if (!urlProductApi) {
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
}

