/* istanbul ignore file */
import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { UserModule } from './auth/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ReportModule } from './report/report.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './auth/model/user.entity';
import { Report } from './report/model/report.entity';
import { APP_PIPE } from '@nestjs/core';
const cookieSession = require('cookie-session');
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `./config/${process.env.NODE_ENV}.env`,
    }),
    TypeOrmModule.forRoot(),
    UserModule,
    ReportModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_PIPE, useValue: new ValidationPipe({ whitelist: true }) },
  ],
})
export class AppModule {
  constructor(private config: ConfigService) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          //key use to encrypt the cookie
          keys: [this.config.get<string>('COOKIE_KEY')],
        }),
      )
      .forRoutes('*');
  }
}
