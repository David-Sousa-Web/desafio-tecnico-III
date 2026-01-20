import { Injectable, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  IExameRepository,
  EXAME_REPOSITORY,
} from '../../domain/interfaces/exame-repository.interface';
import { CreateExameDto } from '../../presentation/dto/create-exame.dto';
import { ExameResponseDto } from '../../presentation/dto/exame-response.dto';
import { ExameMapper } from '../mappers/exame.mapper';
import { PaginationQueryDto } from '../../../../shared/dto/pagination-query.dto';
import { PaginatedResponseDto } from '../../../../shared/dto/paginated-response.dto';
import { EntityNotFoundException } from '../../../../shared/exceptions';
import { PacientesService } from '../../../pacientes/application/services/pacientes.service';

export interface CreateExameResult {
  exame: ExameResponseDto;
  isNew: boolean;
}

@Injectable()
export class ExamesService {
  constructor(
    @Inject(EXAME_REPOSITORY)
    private readonly exameRepository: IExameRepository,
    private readonly pacientesService: PacientesService,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateExameDto): Promise<CreateExameResult> {
    const existingExame = await this.exameRepository.findByIdempotencyKey(
      dto.idempotencyKey,
    );

    if (existingExame) {
      return {
        exame: ExameMapper.toResponse(existingExame),
        isNew: false,
      };
    }

    const pacienteExists = await this.pacientesService.existsById(dto.pacienteId);
    if (!pacienteExists) {
      throw new EntityNotFoundException('Paciente', dto.pacienteId);
    }

    return this.dataSource.transaction(async (manager) => {
      const lockedExame = await this.exameRepository.findByIdempotencyKeyWithLock(
        dto.idempotencyKey,
        manager,
      );

      if (lockedExame) {
        return {
          exame: ExameMapper.toResponse(lockedExame),
          isNew: false,
        };
      }

      const exame = ExameMapper.toDomain(dto);
      const savedExame = await this.exameRepository.createWithManager(exame, manager);

      return {
        exame: ExameMapper.toResponse(savedExame),
        isNew: true,
      };
    });
  }

  async findAll(
    pagination: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<ExameResponseDto>> {
    const result = await this.exameRepository.findAll({
      page: pagination.page,
      pageSize: pagination.pageSize,
    });

    const responseData = result.data.map((exame) => ExameMapper.toResponse(exame));

    return new PaginatedResponseDto(
      responseData,
      result.total,
      result.page,
      result.pageSize,
    );
  }
}

