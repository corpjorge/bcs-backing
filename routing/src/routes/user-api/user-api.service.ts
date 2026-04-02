import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { AxiosError, AxiosResponse } from 'axios';

@Injectable()
export class UserApiService {
  constructor(private readonly httpService: HttpService) {}

  async sendUserData(data: unknown): Promise<unknown> {
    const urlUserApi = process.env.URLUSERAPI;

    if (!urlUserApi) {
      throw new Error('Missing URLUSERAPI environment variable.');
    }

    const url = `http://${urlUserApi}/v1/registration`;
    return this.postRequest<unknown>(url, data);
  }

  async readUserData(data: unknown): Promise<unknown> {
    const urlUserApi = process.env.URLUSERAPI;

    if (!urlUserApi) {
      throw new Error('Missing URLUSERAPI environment variable.');
    }

    const url = `http://${urlUserApi}/v1/read`;
    return this.postRequest<unknown>(url, data);
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
