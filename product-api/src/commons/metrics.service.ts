import { Injectable } from '@nestjs/common';
import { StatsD } from 'hot-shots';

@Injectable()
export class MetricsService {
  private client: StatsD;

  constructor() {
    const host = process.env.DD_AGENT_HOST ?? '127.0.0.1';

    this.client = new StatsD({
      host,
      port: 8125,
      prefix: 'product.',
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
