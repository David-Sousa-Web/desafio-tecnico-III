import { Paciente } from '../entities/paciente.entity';
import {
  PaginatedResult,
  PaginationParams,
} from '../../../../shared/interfaces/paginated-result.interface';

export const PACIENTE_REPOSITORY = 'IPacienteRepository';

export interface IPacienteRepository {
  create(paciente: Paciente): Promise<Paciente>;
  findById(id: string): Promise<Paciente | null>;
  findByDocumento(documento: string): Promise<Paciente | null>;
  findAll(pagination: PaginationParams): Promise<PaginatedResult<Paciente>>;
  existsById(id: string): Promise<boolean>;
}

