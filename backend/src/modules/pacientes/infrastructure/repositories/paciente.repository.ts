import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPacienteRepository } from '../../domain/interfaces/paciente-repository.interface';
import { Paciente } from '../../domain/entities/paciente.entity';
import { PacienteSchema } from '../schemas/paciente.schema';
import {
  PaginatedResult,
  PaginationParams,
} from '../../../../shared/interfaces/paginated-result.interface';

@Injectable()
export class PacienteRepository implements IPacienteRepository {
  constructor(
    @InjectRepository(PacienteSchema)
    private readonly repository: Repository<PacienteSchema>,
  ) {}

  async create(paciente: Paciente): Promise<Paciente> {
    const schema = this.toSchema(paciente);
    const saved = await this.repository.save(schema);
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<Paciente | null> {
    const schema = await this.repository.findOne({ where: { id } });
    return schema ? this.toDomain(schema) : null;
  }

  async findByDocumento(documento: string): Promise<Paciente | null> {
    const schema = await this.repository.findOne({ where: { documento } });
    return schema ? this.toDomain(schema) : null;
  }

  async findAll(pagination: PaginationParams): Promise<PaginatedResult<Paciente>> {
    const { page, pageSize } = pagination;
    const skip = (page - 1) * pageSize;

    const [schemas, total] = await this.repository.findAndCount({
      skip,
      take: pageSize,
      order: { createdAt: 'DESC' },
    });

    return {
      data: schemas.map((schema) => this.toDomain(schema)),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async existsById(id: string): Promise<boolean> {
    const count = await this.repository.count({ where: { id } });
    return count > 0;
  }

  private toSchema(paciente: Paciente): PacienteSchema {
    const schema = new PacienteSchema();
    if (paciente.id) schema.id = paciente.id;
    schema.nome = paciente.nome;
    schema.dataNascimento = paciente.dataNascimento;
    schema.documento = paciente.documento;
    return schema;
  }

  private toDomain(schema: PacienteSchema): Paciente {
    return new Paciente({
      id: schema.id,
      nome: schema.nome,
      dataNascimento: schema.dataNascimento,
      documento: schema.documento,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }
}

