import { Exame } from '../entities/exame.entity';
import {
  PaginatedResult,
  PaginationParams,
} from '../../../../shared/interfaces/paginated-result.interface';

export const EXAME_REPOSITORY = 'IExameRepository';

export interface IExameRepository {
  create(exame: Exame): Promise<Exame>;
  findById(id: string): Promise<Exame | null>;
  findByIdempotencyKey(idempotencyKey: string): Promise<Exame | null>;
  findAll(pagination: PaginationParams): Promise<PaginatedResult<Exame>>;
  findByIdempotencyKeyWithLock(
    idempotencyKey: string,
    manager: unknown,
  ): Promise<Exame | null>;
  createWithManager(exame: Exame, manager: unknown): Promise<Exame>;
}

