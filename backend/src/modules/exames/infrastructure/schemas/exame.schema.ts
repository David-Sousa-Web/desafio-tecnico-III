import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Modalidade } from '../../domain/enums/modalidade.enum';
import { PacienteSchema } from '../../../pacientes/infrastructure/schemas/paciente.schema';

@Entity('exames')
export class ExameSchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'paciente_id' })
  pacienteId: string;

  @ManyToOne(() => PacienteSchema, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'paciente_id' })
  paciente: PacienteSchema;

  @Column({ type: 'enum', enum: Modalidade })
  modalidade: Modalidade;

  @Column({ type: 'date', name: 'data_exame' })
  dataExame: Date;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, unique: true, name: 'idempotency_key' })
  idempotencyKey: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

