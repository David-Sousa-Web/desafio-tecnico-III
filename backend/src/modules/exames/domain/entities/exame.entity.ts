import { Modalidade } from '../enums/modalidade.enum';

export class Exame {
  id: string;
  pacienteId: string;
  modalidade: Modalidade;
  dataExame: Date;
  idempotencyKey: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Exame>) {
    Object.assign(this, partial);
  }

  static create(
    pacienteId: string,
    modalidade: Modalidade,
    dataExame: Date,
    idempotencyKey: string,
  ): Exame {
    return new Exame({
      pacienteId,
      modalidade,
      dataExame,
      idempotencyKey,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

