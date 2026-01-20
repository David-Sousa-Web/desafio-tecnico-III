export class Paciente {
  id: string;
  nome: string;
  dataNascimento: Date;
  documento: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Paciente>) {
    Object.assign(this, partial);
  }

  static create(nome: string, dataNascimento: Date, documento: string): Paciente {
    return new Paciente({
      nome,
      dataNascimento,
      documento,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

