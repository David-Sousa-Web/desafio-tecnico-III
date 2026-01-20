import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamesController } from './presentation/controllers/exames.controller';
import { ExamesService } from './application/services/exames.service';
import { ExameRepository } from './infrastructure/repositories/exame.repository';
import { ExameSchema } from './infrastructure/schemas/exame.schema';
import { EXAME_REPOSITORY } from './domain/interfaces/exame-repository.interface';
import { PacientesModule } from '../pacientes/pacientes.module';

@Module({
  imports: [TypeOrmModule.forFeature([ExameSchema]), PacientesModule],
  controllers: [ExamesController],
  providers: [
    ExamesService,
    {
      provide: EXAME_REPOSITORY,
      useClass: ExameRepository,
    },
  ],
  exports: [ExamesService],
})
export class ExamesModule {}

