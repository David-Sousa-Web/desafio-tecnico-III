import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, EntityManager } from 'typeorm';
import { ExamesService } from './exames.service';
import { EXAME_REPOSITORY } from '../../domain/interfaces/exame-repository.interface';
import { PacientesService } from '../../../pacientes/application/services/pacientes.service';
import { EntityNotFoundException } from '../../../../shared/exceptions';
import { Exame } from '../../domain/entities/exame.entity';
import { Modalidade } from '../../domain/enums/modalidade.enum';

describe('ExamesService', () => {
  let service: ExamesService;
  let mockRepository: {
    create: jest.Mock;
    findById: jest.Mock;
    findByIdempotencyKey: jest.Mock;
    findAll: jest.Mock;
    findByIdempotencyKeyWithLock: jest.Mock;
    createWithManager: jest.Mock;
  };
  let mockPacientesService: {
    existsById: jest.Mock;
  };
  let mockDataSource: {
    transaction: jest.Mock;
  };

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByIdempotencyKey: jest.fn(),
      findAll: jest.fn(),
      findByIdempotencyKeyWithLock: jest.fn(),
      createWithManager: jest.fn(),
    };

    mockPacientesService = {
      existsById: jest.fn(),
    };

    mockDataSource = {
      transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExamesService,
        {
          provide: EXAME_REPOSITORY,
          useValue: mockRepository,
        },
        {
          provide: PacientesService,
          useValue: mockPacientesService,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<ExamesService>(ExamesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto = {
      pacienteId: 'paciente-uuid',
      modalidade: Modalidade.CT,
      dataExame: '2024-01-15',
      idempotencyKey: 'unique-key-123',
    };

    it('should return existing exame when idempotencyKey already exists', async () => {
      const existingExame = new Exame({
        id: 'exame-uuid',
        pacienteId: createDto.pacienteId,
        modalidade: createDto.modalidade,
        dataExame: new Date(createDto.dataExame),
        idempotencyKey: createDto.idempotencyKey,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockRepository.findByIdempotencyKey.mockResolvedValue(existingExame);

      const result = await service.create(createDto);

      expect(result.isNew).toBe(false);
      expect(result.exame.id).toBe('exame-uuid');
      expect(mockPacientesService.existsById).not.toHaveBeenCalled();
      expect(mockDataSource.transaction).not.toHaveBeenCalled();
    });

    it('should throw EntityNotFoundException when paciente does not exist', async () => {
      mockRepository.findByIdempotencyKey.mockResolvedValue(null);
      mockPacientesService.existsById.mockResolvedValue(false);

      await expect(service.create(createDto)).rejects.toThrow(EntityNotFoundException);
      expect(mockDataSource.transaction).not.toHaveBeenCalled();
    });

    it('should create new exame when idempotencyKey is unique and paciente exists', async () => {
      const savedExame = new Exame({
        id: 'new-exame-uuid',
        pacienteId: createDto.pacienteId,
        modalidade: createDto.modalidade,
        dataExame: new Date(createDto.dataExame),
        idempotencyKey: createDto.idempotencyKey,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockRepository.findByIdempotencyKey.mockResolvedValue(null);
      mockPacientesService.existsById.mockResolvedValue(true);
      mockRepository.findByIdempotencyKeyWithLock.mockResolvedValue(null);
      mockRepository.createWithManager.mockResolvedValue(savedExame);

      mockDataSource.transaction.mockImplementation(
        async (callback: (manager: EntityManager) => Promise<unknown>) => {
          const mockManager = {} as EntityManager;
          return callback(mockManager);
        },
      );

      const result = await service.create(createDto);

      expect(result.isNew).toBe(true);
      expect(result.exame.id).toBe('new-exame-uuid');
      expect(result.exame.modalidade).toBe(Modalidade.CT);
    });

    it('should return existing exame if found during transaction lock check', async () => {
      const existingExame = new Exame({
        id: 'locked-exame-uuid',
        pacienteId: createDto.pacienteId,
        modalidade: createDto.modalidade,
        dataExame: new Date(createDto.dataExame),
        idempotencyKey: createDto.idempotencyKey,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockRepository.findByIdempotencyKey.mockResolvedValue(null);
      mockPacientesService.existsById.mockResolvedValue(true);
      mockRepository.findByIdempotencyKeyWithLock.mockResolvedValue(existingExame);

      mockDataSource.transaction.mockImplementation(
        async (callback: (manager: EntityManager) => Promise<unknown>) => {
          const mockManager = {} as EntityManager;
          return callback(mockManager);
        },
      );

      const result = await service.create(createDto);

      expect(result.isNew).toBe(false);
      expect(result.exame.id).toBe('locked-exame-uuid');
      expect(mockRepository.createWithManager).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return paginated exames', async () => {
      const exames = [
        new Exame({
          id: 'exame-1',
          pacienteId: 'paciente-1',
          modalidade: Modalidade.CT,
          dataExame: new Date('2024-01-15'),
          idempotencyKey: 'key-1',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
        new Exame({
          id: 'exame-2',
          pacienteId: 'paciente-2',
          modalidade: Modalidade.MR,
          dataExame: new Date('2024-01-16'),
          idempotencyKey: 'key-2',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ];

      mockRepository.findAll.mockResolvedValue({
        data: exames,
        total: 2,
        page: 1,
        pageSize: 10,
        totalPages: 1,
      });

      const result = await service.findAll({ page: 1, pageSize: 10 });

      expect(mockRepository.findAll).toHaveBeenCalledWith({ page: 1, pageSize: 10 });
      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
    });

    it('should return empty list when no exames exist', async () => {
      mockRepository.findAll.mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
      });

      const result = await service.findAll({ page: 1, pageSize: 10 });

      expect(result.data).toHaveLength(0);
      expect(result.total).toBe(0);
    });
  });
});

