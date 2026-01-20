import { Exame } from '../../domain/entities/exame.entity';
import { CreateExameDto } from '../../presentation/dto/create-exame.dto';
import { ExameResponseDto } from '../../presentation/dto/exame-response.dto';

export class ExameMapper {
  static toDomain(dto: CreateExameDto): Exame {
    return Exame.create(
      dto.pacienteId,
      dto.modalidade,
      new Date(dto.dataExame),
      dto.idempotencyKey,
    );
  }

  static toResponse(entity: Exame): ExameResponseDto {
    return {
      id: entity.id,
      pacienteId: entity.pacienteId,
      modalidade: entity.modalidade,
      dataExame: entity.dataExame.toISOString().split('T')[0],
      idempotencyKey: entity.idempotencyKey,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}

