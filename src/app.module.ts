import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UserModule } from './auth/user.module';
import { ReportModule } from './report/report.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './auth/model/user.entity';
import { Report } from './report/model/report.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Report],
      synchronize: true,
    }),
    UserModule,
    ReportModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
