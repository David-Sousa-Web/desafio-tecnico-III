export interface Paciente {
  id: string;
  nome: string;
  dataNascimento: string;
  documento: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePacienteDto {
  nome: string;
  dataNascimento: string;
  documento: string;
}

