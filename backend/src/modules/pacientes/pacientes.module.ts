import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacientesController } from './presentation/controllers/pacientes.controller';
import { PacientesService } from './application/services/pacientes.service';
import { PacienteRepository } from './infrastructure/repositories/paciente.repository';
import { PacienteSchema } from './infrastructure/schemas/paciente.schema';
import { PACIENTE_REPOSITORY } from './domain/interfaces/paciente-repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([PacienteSchema])],
  controllers: [PacientesController],
  providers: [
    PacientesService,
    {
      provide: PACIENTE_REPOSITORY,
      useClass: PacienteRepository,
    },
  ],
  exports: [PacientesService, PACIENTE_REPOSITORY],
})
export class PacientesModule {}

