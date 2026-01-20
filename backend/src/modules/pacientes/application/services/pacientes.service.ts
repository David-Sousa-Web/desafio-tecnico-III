import { Injectable, Inject } from '@nestjs/common';
import {
  IPacienteRepository,
  PACIENTE_REPOSITORY,
} from '../../domain/interfaces/paciente-repository.interface';
import { CreatePacienteDto } from '../../presentation/dto/create-paciente.dto';
import { PacienteResponseDto } from '../../presentation/dto/paciente-response.dto';
import { PacienteMapper } from '../mappers/paciente.mapper';
import { PaginationQueryDto } from '../../../../shared/dto/pagination-query.dto';
import { PaginatedResponseDto } from '../../../../shared/dto/paginated-response.dto';
import { DuplicateEntityException } from '../../../../shared/exceptions';

@Injectable()
export class PacientesService {
  constructor(
    @Inject(PACIENTE_REPOSITORY)
    private readonly pacienteRepository: IPacienteRepository,
  ) {}

  async create(dto: CreatePacienteDto): Promise<PacienteResponseDto> {
    const existingPaciente = await this.pacienteRepository.findByDocumento(
      dto.documento,
    );

    if (existingPaciente) {
      throw new DuplicateEntityException('Paciente', 'documento', dto.documento);
    }

    const paciente = PacienteMapper.toDomain(dto);
    const savedPaciente = await this.pacienteRepository.create(paciente);

    return PacienteMapper.toResponse(savedPaciente);
  }

  async findAll(
    pagination: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<PacienteResponseDto>> {
    const result = await this.pacienteRepository.findAll({
      page: pagination.page,
      pageSize: pagination.pageSize,
    });

    const responseData = result.data.map((paciente) =>
      PacienteMapper.toResponse(paciente),
    );

    return new PaginatedResponseDto(
      responseData,
      result.total,
      result.page,
      result.pageSize,
    );
  }

  async existsById(id: string): Promise<boolean> {
    return this.pacienteRepository.existsById(id);
  }
}

