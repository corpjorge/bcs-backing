import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

const logExporter = new OTLPLogExporter({
  url: 'https://otlp-gateway-prod-us-east-3.grafana.net/otlp/v1/logs',
  headers: {
    Authorization:
      'Basic MTU4MDY0MDpnbGNfZXlKdklqb2lNVGN4T1RBME9DSXNJbTRpT2lKNWIzVnlMV2R5WVdaaGJtRXRkRzlyWlc0aUxDSnJJam9pWTNGcU9ERjZZak0zVHpSQ016SXhVa3hMTlhacFVHZzNJaXdpYlNJNmV5SnlJam9pY0hKdlpDMTFjeTFsWVhOMExUTWlmWDA9',
  },
});

export const otelSdk = new NodeSDK({
  logRecordProcessor: new BatchLogRecordProcessor(logExporter),
  instrumentations: [getNodeAutoInstrumentations()],
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: 'product-api',
  }),
});

otelSdk.start();
