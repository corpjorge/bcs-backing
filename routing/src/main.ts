import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EncryptInterceptor } from './commons/encrypt.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(app.get(EncryptInterceptor));

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
