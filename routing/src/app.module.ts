import { Module } from '@nestjs/common';
import { EncryptInterceptor } from './commons/encrypt.interceptor';
import { ConfigModule } from '@nestjs/config';
import { UserApiModule } from './routes/user-api/user-api.module';
import { MiddlewareConsumer } from '@nestjs/common';
import { RequestMethod } from '@nestjs/common';
import { DecryptMiddleware } from './commons/decrypt.middleware';
import { HttpModule } from '@nestjs/axios';
import { EncryptModule } from './routes/encrypt/encrypt.module';
import { ProductsModule } from './routes/products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule,
    UserApiModule,
    EncryptModule,
    ProductsModule,
  ],
  providers: [EncryptInterceptor],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DecryptMiddleware)
      .exclude(
        { path: 'encrypt', method: RequestMethod.POST },
        { path: 'decrypt', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}
