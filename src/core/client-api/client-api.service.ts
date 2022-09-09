import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import { AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from 'axios';
import { catchError, firstValueFrom, map, Observable, of } from 'rxjs';

export abstract class ClientApiService {
  protected abstract readonly logger: Logger;
  protected readonly apiUrl: string;
  private readonly defaultConfig: AxiosRequestConfig = { timeout: 25000 };

  protected constructor(private readonly http: HttpService, apiUrl: string) {
    this.apiUrl = apiUrl.replace(/\/$/, '');
  }

  protected get<T, U = T, D = unknown>(
    endpoint: string,
    token: string | null,
    params: D,
    fallback: U,
    headers: AxiosRequestHeaders = {},
  ): Promise<T | U> {
    const url = `${this.apiUrl}/${endpoint}`;
    const config = this.createAxiosConfig(token, { params, headers });
    return this.handleAxiosResponse(url, fallback, this.http.get<T>(url, config));
  }

  protected post<T, U = T, D = unknown>(endpoint: string, token: string | null, data: D, fallback: U): Promise<T | U> {
    const url = `${this.apiUrl}/${endpoint}`;
    const config = this.createAxiosConfig(token);
    return this.handleAxiosResponse(url, fallback, this.http.post<T>(url, data, config));
  }

  private createAxiosConfig(token: string | null, baseConfig: AxiosRequestConfig = {}): AxiosRequestConfig {
    const config: AxiosRequestConfig = { ...this.defaultConfig, ...baseConfig };
    if (token) {
      config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
    }
    return config;
  }

  private handleAxiosResponse<T, U>(
    url: string,
    fallback: U,
    observable: Observable<AxiosResponse<T>>,
  ): Promise<T | U> {
    return firstValueFrom(
      observable.pipe(
        map((response) => response.data),
        catchError((err) => {
          const code = err.response ? `, code: ${err.response.status}` : '';
          this.logger.error(`url: ${url} , message: ${err.message} ${code}`);
          return of(fallback);
        }),
      ),
    );
  }
}
