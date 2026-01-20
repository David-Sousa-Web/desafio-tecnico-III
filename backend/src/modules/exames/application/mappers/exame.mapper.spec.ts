import { ExameMapper } from './exame.mapper';
import { Exame } from '../../domain/entities/exame.entity';
import { CreateExameDto } from '../../presentation/dto/create-exame.dto';
import { Modalidade } from '../../domain/enums/modalidade.enum';

describe('ExameMapper', () => {
  describe('toDomain', () => {
    it('should convert CreateExameDto to Exame entity', () => {
      const dto: CreateExameDto = {
        pacienteId: 'paciente-uuid',
        modalidade: Modalidade.CT,
        dataExame: '2024-01-15',
        idempotencyKey: 'unique-key-123',
      };

      const result = ExameMapper.toDomain(dto);

      expect(result).toBeInstanceOf(Exame);
      expect(result.pacienteId).toBe(dto.pacienteId);
      expect(result.modalidade).toBe(Modalidade.CT);
      expect(result.idempotencyKey).toBe(dto.idempotencyKey);
      expect(result.dataExame).toBeInstanceOf(Date);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    it('should handle all DICOM modalities', () => {
      const modalities = Object.values(Modalidade);

      modalities.forEach((modalidade) => {
        const dto: CreateExameDto = {
          pacienteId: 'paciente-uuid',
          modalidade,
          dataExame: '2024-01-15',
          idempotencyKey: `key-${modalidade}`,
        };

        const result = ExameMapper.toDomain(dto);
        expect(result.modalidade).toBe(modalidade);
      });
    });
  });

  describe('toResponse', () => {
    it('should convert Exame entity to ExameResponseDto', () => {
      const exame = new Exame({
        id: 'exame-uuid',
        pacienteId: 'paciente-uuid',
        modalidade: Modalidade.MR,
        dataExame: new Date('2024-01-15'),
        idempotencyKey: 'unique-key-123',
        createdAt: new Date('2024-01-01T10:00:00Z'),
        updatedAt: new Date('2024-01-01T10:00:00Z'),
      });

      const result = ExameMapper.toResponse(exame);

      expect(result.id).toBe('exame-uuid');
      expect(result.pacienteId).toBe('paciente-uuid');
      expect(result.modalidade).toBe(Modalidade.MR);
      expect(result.idempotencyKey).toBe('unique-key-123');
      expect(result.dataExame).toBe('2024-01-15');
      expect(result.createdAt).toContain('2024-01-01');
      expect(result.updatedAt).toContain('2024-01-01');
    });
  });
});

