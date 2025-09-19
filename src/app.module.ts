import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import configuration from './config/configuration';
import { getTypeOrmConfig } from './database/typeorm.config';

import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { ReportsModule } from './reports/reports.module';
import { ContentfulModule } from './contentful/contentful.module';
import { TasksModule } from './tasks/tasks.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRootAsync({ useFactory: getTypeOrmConfig }),
    ScheduleModule.forRoot(),
    AuthModule,
    ProductsModule,
    ReportsModule,
    ContentfulModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
