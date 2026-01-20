import { Paciente } from '../../domain/entities/paciente.entity';
import { CreatePacienteDto } from '../../presentation/dto/create-paciente.dto';
import { PacienteResponseDto } from '../../presentation/dto/paciente-response.dto';

export class PacienteMapper {
  static toDomain(dto: CreatePacienteDto): Paciente {
    return Paciente.create(dto.nome, new Date(dto.dataNascimento), dto.documento);
  }

  static toResponse(entity: Paciente): PacienteResponseDto {
    return {
      id: entity.id,
      nome: entity.nome,
      dataNascimento: entity.dataNascimento.toISOString().split('T')[0],
      documento: entity.documento,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}

