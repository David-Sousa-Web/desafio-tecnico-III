import { PacienteMapper } from './paciente.mapper';
import { Paciente } from '../../domain/entities/paciente.entity';
import { CreatePacienteDto } from '../../presentation/dto/create-paciente.dto';

describe('PacienteMapper', () => {
  describe('toDomain', () => {
    it('should convert CreatePacienteDto to Paciente entity', () => {
      const dto: CreatePacienteDto = {
        nome: 'João Silva',
        dataNascimento: '1990-05-15',
        documento: '12345678901',
      };

      const result = PacienteMapper.toDomain(dto);

      expect(result).toBeInstanceOf(Paciente);
      expect(result.nome).toBe(dto.nome);
      expect(result.documento).toBe(dto.documento);
      expect(result.dataNascimento).toBeInstanceOf(Date);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('toResponse', () => {
    it('should convert Paciente entity to PacienteResponseDto', () => {
      const paciente = new Paciente({
        id: 'uuid-123',
        nome: 'João Silva',
        dataNascimento: new Date('1990-05-15'),
        documento: '12345678901',
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
      });

      const result = PacienteMapper.toResponse(paciente);

      expect(result.id).toBe('uuid-123');
      expect(result.nome).toBe('João Silva');
      expect(result.documento).toBe('12345678901');
      expect(result.dataNascimento).toBe('1990-05-15');
      expect(result.createdAt).toContain('2024-01-01');
      expect(result.updatedAt).toContain('2024-01-01');
    });
  });
});

