import { Modalidade } from '../../domain/enums/modalidade.enum';

export class ExameResponseDto {
  id: string;
  pacienteId: string;
  modalidade: Modalidade;
  dataExame: string;
  idempotencyKey: string;
  createdAt: string;
  updatedAt: string;
}

