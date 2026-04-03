# bcs-backing

Monorepo que agrupa multiples aplicaciones para la plataforma BCS: un frontend en Next.js y varios servicios backend en NestJS. El proyecto trabaja con una arquitectura basada en microservicios y enfoque hexagonal, con integraciones sobre MongoDB, Redis y observabilidad con Datadog/OpenTelemetry.

## Aplicaciones

- `bcs-frontend`: aplicacion web construida con Next.js.
- `routing`: servicio NestJS que centraliza el enrutamiento y la comunicacion entre APIs.
- `user-api`: microservicio NestJS para la gestion de usuarios con persistencia en MongoDB.
- `product-api`: microservicio NestJS para la gestion de productos con MongoDB y Redis.

## Tecnologias principales

- `Next.js` y React para el frontend.
- `NestJS` y TypeScript para los servicios backend.
- `MongoDB` como base de datos principal.
- `Redis` para cache y soporte de alto rendimiento.
- `Datadog` y `OpenTelemetry/Grafana` para trazabilidad y monitoreo.
- `Arquitectura hexagonal` para separar dominio, aplicacion e infraestructura.
