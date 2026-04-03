# Historias Tecnicas

## Objetivo

Definir las historias tecnicas necesarias para implementar la solucion completa del proyecto, considerando `bcs-frontend`, `routing`, `user-api`, `product-api` y la integracion `Micrositio-Core` por medio de `MuleSoft`.

## Contexto

La solucion esta compuesta por:

- `bcs-frontend`: micrositio web en `Next.js`.
- `routing`: gateway seguro entre frontend y microservicios.
- `user-api`: gestion de usuarios y autenticacion.
- `product-api`: gestion de productos e integracion externa.
- `MuleSoft mock / Core`: fuente externa para consulta de productos.

## Historias tecnicas base

### HT-01 - Micrositio de autenticacion y registro

**Como** equipo de desarrollo  
**Quiero** implementar en `bcs-frontend` los flujos de login, registro y gestion de sesion  
**Para** permitir el acceso seguro de usuarios al micrositio.

**Criterios de aceptacion**

- Debe existir una pantalla de login y una pantalla de registro.
- El frontend debe consumir `routing` como unica puerta de entrada al backend.
- Las credenciales deben enviarse cifradas antes de salir del frontend.
- La sesion debe persistirse con cookies `httpOnly`.
- Si no existe sesion valida, las vistas protegidas deben redirigir al login.

**Consideraciones de seguridad**

- No almacenar credenciales en `localStorage`.
- Proteger cookies con `httpOnly`, `sameSite` y `secure` en produccion.
- Evitar exponer payloads sensibles en logs del navegador.

### HT-02 - Gateway de enrutamiento seguro

**Como** equipo de arquitectura  
**Quiero** implementar `routing` como gateway entre micrositio y servicios core  
**Para** centralizar cifrado, descifrado, autenticacion y trazabilidad.

**Criterios de aceptacion**

- `routing` debe exponer endpoints para usuarios, productos, autenticacion, cifrado y descifrado.
- Debe descifrar los cuerpos entrantes antes de delegar a los backends.
- Debe cifrar las respuestas salientes de forma global.
- Debe generar y validar `JWT` para proteger rutas sensibles.
- Debe enrutar solicitudes a `user-api` y `product-api` mediante variables de entorno.

**Consideraciones de seguridad**

- La clave `APPENCKEY` debe ser de `32 bytes` en `base64`.
- El cifrado debe usar `AES-256-GCM`.
- Las rutas protegidas deben exigir `Bearer token`.
- Los errores no deben revelar secretos ni detalles criptograficos.

### HT-03 - Gestion de usuarios en Core

**Como** equipo de backend  
**Quiero** implementar `user-api` para registro y validacion de usuarios  
**Para** soportar autenticacion y consulta segura de identidad.

**Criterios de aceptacion**

- Debe existir `POST /v1/registration` para crear usuarios.
- Debe existir `POST /v1/read` para validar credenciales.
- La informacion debe persistirse en `MongoDB`.
- La contrasena debe almacenarse cifrada mediante hash.
- Debe retornarse solo la informacion necesaria del usuario autenticado.

**Consideraciones de seguridad**

- Hash de contrasenas con `scrypt` y `salt`.
- No devolver la contrasena en ninguna respuesta.
- Rechazar credenciales invalidas con respuesta controlada.

### HT-04 - Gestion de productos en Core

**Como** equipo de backend  
**Quiero** implementar `product-api` para registrar y consultar productos  
**Para** soportar el flujo de solicitud y consulta desde el micrositio.

**Criterios de aceptacion**

- Debe existir `POST /v1/registration` para registrar productos.
- Debe existir `GET /v1/read` para consultar productos registrados por usuario.
- La informacion debe persistirse en `MongoDB`.
- Debe validarse el tipo de producto y los datos obligatorios.
- Debe existir cobertura de pruebas unitarias y `e2e`.

**Consideraciones de seguridad**

- Validar inputs con DTOs y `class-validator`.
- Evitar exponer datos internos de persistencia.
- Mantener trazabilidad de operaciones via observabilidad.

## Historias tecnicas de integracion Micrositio-Core

### HT-05 - Integracion Micrositio-Core para consulta de productos externos

**Como** micrositio BCS  
**Quiero** consultar productos disponibles del Core a traves de `routing` y `product-api`  
**Para** mostrar al usuario un catalogo de productos consumido desde la integracion `MuleSoft`.

**Criterios de aceptacion**

- El frontend debe consumir `routing /products/v1/products`.
- `routing` debe delegar la consulta a `product-api`.
- `product-api` debe consultar la fuente externa configurada en `MULESOFT_CORE_URL`.
- Si la respuesta externa es valida, debe devolverse una lista normalizada de productos.
- La respuesta al frontend debe salir cifrada desde `routing`.

**Consideraciones de seguridad**

- La llamada del frontend al gateway debe usar payload cifrado cuando aplique.
- Los errores del proveedor externo no deben exponer datos sensibles.
- Los logs deben registrar trazabilidad, pero no secretos ni credenciales.

### HT-06 - Integracion Micrositio-Core con cache y resiliencia

**Como** equipo de integracion  
**Quiero** incorporar cache en `Redis` para la consulta `Micrositio-Core` via `MuleSoft`  
**Para** mejorar tiempos de respuesta y resiliencia ante fallas del servicio externo.

**Criterios de aceptacion**

- `product-api` debe consultar primero `Redis` antes de ir a la fuente externa.
- Si existe `cache hit`, la respuesta debe salir desde cache.
- Si existe `cache miss`, `product-api` debe consultar `MuleSoft`, guardar el resultado en `Redis` y responder al cliente.
- Deben registrarse eventos de `cache hit`, `cache miss` y error de integracion.
- El flujo debe ser observable desde `Datadog` y `Grafana`.

**Consideraciones de seguridad**

- No almacenar secretos del proveedor externo en codigo fuente.
- Definir claves de cache que no expongan informacion sensible innecesaria.
- Validar y sanitizar respuestas externas antes de persistirlas en cache.

## Historias complementarias

### HT-07 - Observabilidad extremo a extremo

**Como** equipo de soporte y plataforma  
**Quiero** instrumentar frontend y backends con trazabilidad y metricas  
**Para** monitorear disponibilidad, errores y comportamiento operativo.

**Criterios de aceptacion**

- `routing`, `user-api` y `product-api` deben exportar logs por `OpenTelemetry`.
- Las metricas deben publicarse hacia `Datadog Agent`.
- Deben existir dashboards o evidencias de monitoreo en `Datadog` y `Grafana`.
- Los flujos criticos de login, registro y productos deben ser trazables.

**Consideraciones de seguridad**

- No incluir credenciales ni payloads completos en logs.
- Restringir acceso a dashboards y llaves de observabilidad.

### HT-08 - QA tecnico del ecosistema

**Como** equipo de calidad  
**Quiero** definir pruebas tecnicas para cada aplicacion y para la integracion completa  
**Para** asegurar estabilidad del micrositio y del Core.

**Criterios de aceptacion**

- Deben existir pruebas unitarias en `routing`, `user-api` y `product-api`.
- Deben existir pruebas `e2e` para flujos criticos.
- Deben validarse escenarios de login, registro, consulta y solicitud de productos.
- Deben probarse escenarios de integracion con `MuleSoft mock`.

**Consideraciones de seguridad**

- Incluir pruebas negativas de autenticacion y autorizacion.
- Validar rechazo de payloads malformados o no cifrados en `routing`.

## Resumen

Las historias anteriores cubren la implementacion tecnica del ecosistema completo y cumplen el requerimiento de incluir al menos dos historias tecnicas de integracion `Micrositio-Core`:

- `HT-05`: consulta de productos externos via `MuleSoft`
- `HT-06`: cache, resiliencia y seguridad para la integracion `Micrositio-Core`
