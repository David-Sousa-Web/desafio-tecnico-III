import { Test, TestingModule } from '@nestjs/testing';
import { PacientesService } from './pacientes.service';
import { PACIENTE_REPOSITORY } from '../../domain/interfaces/paciente-repository.interface';
import { DuplicateEntityException } from '../../../../shared/exceptions';
import { Paciente } from '../../domain/entities/paciente.entity';

describe('PacientesService', () => {
  let service: PacientesService;
  let mockRepository: {
    create: jest.Mock;
    findById: jest.Mock;
    findByDocumento: jest.Mock;
    findAll: jest.Mock;
    existsById: jest.Mock;
  };

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByDocumento: jest.fn(),
      findAll: jest.fn(),
      existsById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PacientesService,
        {
          provide: PACIENTE_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PacientesService>(PacientesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto = {
      nome: 'João Silva',
      dataNascimento: '1990-05-15',
      documento: '12345678901',
    };

    it('should create a new paciente successfully', async () => {
      const savedPaciente = new Paciente({
        id: 'uuid-123',
        nome: createDto.nome,
        dataNascimento: new Date(createDto.dataNascimento),
        documento: createDto.documento,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockRepository.findByDocumento.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue(savedPaciente);

      const result = await service.create(createDto);

      expect(mockRepository.findByDocumento).toHaveBeenCalledWith(createDto.documento);
      expect(mockRepository.create).toHaveBeenCalled();
      expect(result.id).toBe('uuid-123');
      expect(result.nome).toBe(createDto.nome);
      expect(result.documento).toBe(createDto.documento);
    });

    it('should throw DuplicateEntityException when documento already exists', async () => {
      const existingPaciente = new Paciente({
        id: 'existing-uuid',
        nome: 'Existing',
        dataNascimento: new Date(),
        documento: createDto.documento,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockRepository.findByDocumento.mockResolvedValue(existingPaciente);

      await expect(service.create(createDto)).rejects.toThrow(DuplicateEntityException);
      expect(mockRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return paginated pacientes', async () => {
      const pacientes = [
        new Paciente({
          id: 'uuid-1',
          nome: 'Paciente 1',
          dataNascimento: new Date('1990-01-01'),
          documento: '11111111111',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
        new Paciente({
          id: 'uuid-2',
          nome: 'Paciente 2',
          dataNascimento: new Date('1985-06-15'),
          documento: '22222222222',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ];

      mockRepository.findAll.mockResolvedValue({
        data: pacientes,
        total: 2,
        page: 1,
        pageSize: 10,
        totalPages: 1,
      });

      const result = await service.findAll({ page: 1, pageSize: 10 });

      expect(mockRepository.findAll).toHaveBeenCalledWith({ page: 1, pageSize: 10 });
      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(1);
    });

    it('should return empty list when no pacientes exist', async () => {
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

  describe('existsById', () => {
    it('should return true when paciente exists', async () => {
      mockRepository.existsById.mockResolvedValue(true);

      const result = await service.existsById('uuid-123');

      expect(mockRepository.existsById).toHaveBeenCalledWith('uuid-123');
      expect(result).toBe(true);
    });

    it('should return false when paciente does not exist', async () => {
      mockRepository.existsById.mockResolvedValue(false);

      const result = await service.existsById('non-existent-uuid');

      expect(result).toBe(false);
    });
  });
});

