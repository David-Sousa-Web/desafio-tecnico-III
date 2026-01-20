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
    const dataExame =
      entity.dataExame instanceof Date
        ? entity.dataExame.toISOString().split('T')[0]
        : String(entity.dataExame);

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
      pacienteId: entity.pacienteId,
      modalidade: entity.modalidade,
      dataExame,
      idempotencyKey: entity.idempotencyKey,
      createdAt,
      updatedAt,
    };
  }
}

