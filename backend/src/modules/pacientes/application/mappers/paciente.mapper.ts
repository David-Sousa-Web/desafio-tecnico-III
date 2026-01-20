import { Paciente } from '../../domain/entities/paciente.entity';
import { CreatePacienteDto } from '../../presentation/dto/create-paciente.dto';
import { PacienteResponseDto } from '../../presentation/dto/paciente-response.dto';

export class PacienteMapper {
  static toDomain(dto: CreatePacienteDto): Paciente {
    return Paciente.create(dto.nome, new Date(dto.dataNascimento), dto.documento);
  }

  static toResponse(entity: Paciente): PacienteResponseDto {
    const dataNascimento =
      entity.dataNascimento instanceof Date
        ? entity.dataNascimento.toISOString().split('T')[0]
        : String(entity.dataNascimento);

    const createdAt =
      entity.createdAt instanceof Date
        ? entity.createdAt.toISOString()
        : String(entity.createdAt);

    const updatedAt =
      entity.updatedAt instanceof Date
        ? entity.updatedAt.toISOString()
        : String(entity.updatedAt);

    return {
      id: entity.id,
      nome: entity.nome,
      dataNascimento,
      documento: entity.documento,
      createdAt,
      updatedAt,
    };
  }
}

