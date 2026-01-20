import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PacientesService } from '../../application/services/pacientes.service';
import { CreatePacienteDto } from '../dto/create-paciente.dto';
import { PacienteResponseDto } from '../dto/paciente-response.dto';
import { PaginationQueryDto } from '../../../../shared/dto/pagination-query.dto';
import { PaginatedResponseDto } from '../../../../shared/dto/paginated-response.dto';

@Controller('pacientes')
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreatePacienteDto): Promise<PacienteResponseDto> {
    return this.pacientesService.create(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() pagination: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<PacienteResponseDto>> {
    return this.pacientesService.findAll(pagination);
  }
}

