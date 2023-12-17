import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { MetricsModule } from './metrics/metrics.module';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { Metric } from './metrics/entities/metric.entity';
import { AlertModule } from './alert/alert.module';
import { Alert } from './alert/entities/alert.entity';
import { UserRel } from './user/entities/user-rel.entity';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { AllExceptionsFilter } from './common/exceptionHandler/allExceptionsFilter';
import { ValidationPipe } from './common/validator/validationPipe';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASS'),
        database: configService.get<string>('DB_NAME'),
        entities: [User, Metric, Alert, UserRel],
        synchronize: true,
        logging: true,
      }),
    }),
    UserModule,
    MetricsModule,
    AuthModule,
    AlertModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
