import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from './shared/shared.module';
import { PacientesModule } from './modules/pacientes/pacientes.module';
import { ExamesModule } from './modules/exames/exames.module';
import { envConfig } from './config/env.config';
import { validate } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
      validate,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('env.database.host'),
        port: configService.get<number>('env.database.port'),
        username: configService.get<string>('env.database.username'),
        password: configService.get<string>('env.database.password'),
        database: configService.get<string>('env.database.database'),
        autoLoadEntities: true,
        synchronize: configService.get<string>('env.nodeEnv') !== 'production',
      }),
      inject: [ConfigService],
    }),
    SharedModule,
    PacientesModule,
    ExamesModule,
  ],
})
export class AppModule {}

