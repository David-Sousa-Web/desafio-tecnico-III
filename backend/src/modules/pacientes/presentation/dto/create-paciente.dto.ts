import { IsNotEmpty, IsString, IsDateString, Length } from 'class-validator';

export class CreatePacienteDto {
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @IsString({ message: 'O nome deve ser uma string' })
  @Length(2, 255, { message: 'O nome deve ter entre 2 e 255 caracteres' })
  nome: string;

  @IsNotEmpty({ message: 'A data de nascimento é obrigatória' })
  @IsDateString({}, { message: 'A data de nascimento deve ser uma data válida' })
  dataNascimento: string;

  @IsNotEmpty({ message: 'O documento é obrigatório' })
  @IsString({ message: 'O documento deve ser uma string' })
  @Length(5, 20, { message: 'O documento deve ter entre 5 e 20 caracteres' })
  documento: string;
}

