import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsEnum,
  IsUUID,
  Length,
} from 'class-validator';
import { Modalidade } from '../../domain/enums/modalidade.enum';

export class CreateExameDto {
  @IsNotEmpty({ message: 'O ID do paciente é obrigatório' })
  @IsUUID('4', { message: 'O ID do paciente deve ser um UUID válido' })
  pacienteId: string;

  @IsNotEmpty({ message: 'A modalidade é obrigatória' })
  @IsEnum(Modalidade, {
    message: `A modalidade deve ser uma das seguintes: ${Object.values(Modalidade).join(', ')}`,
  })
  modalidade: Modalidade;

  @IsNotEmpty({ message: 'A data do exame é obrigatória' })
  @IsDateString({}, { message: 'A data do exame deve ser uma data válida' })
  dataExame: string;

  @IsNotEmpty({ message: 'A chave de idempotência é obrigatória' })
  @IsString({ message: 'A chave de idempotência deve ser uma string' })
  @Length(1, 255, {
    message: 'A chave de idempotência deve ter entre 1 e 255 caracteres',
  })
  idempotencyKey: string;
}

