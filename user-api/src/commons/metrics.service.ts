import { Injectable } from '@nestjs/common';
import { StatsD } from 'hot-shots';

@Injectable()
export class MetricsService {
  private client: StatsD;

  constructor() {
    this.client = new StatsD({
      host: '127.0.0.1',
      port: 8125,
      prefix: 'nestjs.',
    });
  }

  increment(metric: string): void {
    this.client.increment(metric);
  }

  gauge(metric: string, value: number): void {
    this.client.gauge(metric, value);
  }

  histogram(metric: string, value: number): void {
    this.client.histogram(metric, value);
  }
}
