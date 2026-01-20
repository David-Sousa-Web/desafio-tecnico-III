import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { IExameRepository } from '../../domain/interfaces/exame-repository.interface';
import { Exame } from '../../domain/entities/exame.entity';
import { ExameSchema } from '../schemas/exame.schema';
import {
  PaginatedResult,
  PaginationParams,
} from '../../../../shared/interfaces/paginated-result.interface';

@Injectable()
export class ExameRepository implements IExameRepository {
  constructor(
    @InjectRepository(ExameSchema)
    private readonly repository: Repository<ExameSchema>,
  ) {}

  async create(exame: Exame): Promise<Exame> {
    const schema = this.toSchema(exame);
    const saved = await this.repository.save(schema);
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<Exame | null> {
    const schema = await this.repository.findOne({ where: { id } });
    return schema ? this.toDomain(schema) : null;
  }

  async findByIdempotencyKey(idempotencyKey: string): Promise<Exame | null> {
    const schema = await this.repository.findOne({ where: { idempotencyKey } });
    return schema ? this.toDomain(schema) : null;
  }

  async findAll(pagination: PaginationParams): Promise<PaginatedResult<Exame>> {
    const { page, pageSize } = pagination;
    const skip = (page - 1) * pageSize;

    const [schemas, total] = await this.repository.findAndCount({
      skip,
      take: pageSize,
      order: { createdAt: 'DESC' },
      relations: ['paciente'],
    });

    return {
      data: schemas.map((schema) => this.toDomain(schema)),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findByIdempotencyKeyWithLock(
    idempotencyKey: string,
    manager: EntityManager,
  ): Promise<Exame | null> {
    const schema = await manager.findOne(ExameSchema, {
      where: { idempotencyKey },
      lock: { mode: 'pessimistic_write' },
    });
    return schema ? this.toDomain(schema) : null;
  }

  async createWithManager(exame: Exame, manager: EntityManager): Promise<Exame> {
    const schema = this.toSchema(exame);
    const saved = await manager.save(ExameSchema, schema);
    return this.toDomain(saved);
  }

  private toSchema(exame: Exame): ExameSchema {
    const schema = new ExameSchema();
    if (exame.id) schema.id = exame.id;
    schema.pacienteId = exame.pacienteId;
    schema.modalidade = exame.modalidade;
    schema.dataExame = exame.dataExame;
    schema.idempotencyKey = exame.idempotencyKey;
    return schema;
  }

  private toDomain(schema: ExameSchema): Exame {
    return new Exame({
      id: schema.id,
      pacienteId: schema.pacienteId,
      modalidade: schema.modalidade,
      dataExame: schema.dataExame,
      idempotencyKey: schema.idempotencyKey,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }
}

