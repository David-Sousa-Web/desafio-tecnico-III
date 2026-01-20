import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { GlobalExceptionFilter } from '../src/shared/filters/global-exception.filter';
import { DataSource } from 'typeorm';
import { Modalidade } from '../src/modules/exames/domain/enums/modalidade.enum';

describe('ExamesController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let pacienteId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    app.useGlobalFilters(new GlobalExceptionFilter());

    await app.init();
    dataSource = app.get(DataSource);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await dataSource.query('DELETE FROM exames');
    await dataSource.query('DELETE FROM pacientes');

    const response = await request(app.getHttpServer())
      .post('/pacientes')
      .send({
        nome: 'Paciente Teste',
        dataNascimento: '1990-01-01',
        documento: '00000000000',
      });

    pacienteId = response.body.id;
  });

  describe('POST /exames', () => {
    it('should create a new exame with valid data (201)', async () => {
      const createDto = {
        pacienteId,
        modalidade: Modalidade.CT,
        dataExame: '2024-01-15',
        idempotencyKey: 'unique-key-001',
      };

      const response = await request(app.getHttpServer())
        .post('/exames')
        .send(createDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.pacienteId).toBe(pacienteId);
      expect(response.body.modalidade).toBe(Modalidade.CT);
      expect(response.body.dataExame).toBe(createDto.dataExame);
      expect(response.body.idempotencyKey).toBe(createDto.idempotencyKey);
    });

    it('should return 200 with same exame when idempotencyKey already exists', async () => {
      const createDto = {
        pacienteId,
        modalidade: Modalidade.MR,
        dataExame: '2024-01-15',
        idempotencyKey: 'duplicate-key-001',
      };

      const firstResponse = await request(app.getHttpServer())
        .post('/exames')
        .send(createDto)
        .expect(201);

      const secondResponse = await request(app.getHttpServer())
        .post('/exames')
        .send(createDto)
        .expect(200);

      expect(secondResponse.body.id).toBe(firstResponse.body.id);
      expect(secondResponse.body.idempotencyKey).toBe(createDto.idempotencyKey);
    });

    it('should return 400 when paciente does not exist', async () => {
      const response = await request(app.getHttpServer())
        .post('/exames')
        .send({
          pacienteId: '00000000-0000-0000-0000-000000000000',
          modalidade: Modalidade.CT,
          dataExame: '2024-01-15',
          idempotencyKey: 'key-no-paciente',
        })
        .expect(400);

      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toContain('Paciente');
    });

    it('should return 400 when modalidade is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/exames')
        .send({
          pacienteId,
          modalidade: 'INVALID_MODALIDADE',
          dataExame: '2024-01-15',
          idempotencyKey: 'key-invalid-modalidade',
        })
        .expect(400);

      expect(response.body.statusCode).toBe(400);
    });

    it('should return 400 when required fields are missing', async () => {
      const response = await request(app.getHttpServer())
        .post('/exames')
        .send({})
        .expect(400);

      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toBeInstanceOf(Array);
    });

    it('should return 400 when pacienteId is not a valid UUID', async () => {
      const response = await request(app.getHttpServer())
        .post('/exames')
        .send({
          pacienteId: 'invalid-uuid',
          modalidade: Modalidade.CT,
          dataExame: '2024-01-15',
          idempotencyKey: 'key-invalid-uuid',
        })
        .expect(400);

      expect(response.body.statusCode).toBe(400);
    });

    it('should accept all valid DICOM modalities', async () => {
      const modalities = Object.values(Modalidade);

      for (let i = 0; i < modalities.length; i++) {
        const response = await request(app.getHttpServer())
          .post('/exames')
          .send({
            pacienteId,
            modalidade: modalities[i],
            dataExame: '2024-01-15',
            idempotencyKey: `key-modalidade-${i}`,
          })
          .expect(201);

        expect(response.body.modalidade).toBe(modalities[i]);
      }
    });

    it('should handle concurrent requests with same idempotencyKey', async () => {
      const createDto = {
        pacienteId,
        modalidade: Modalidade.US,
        dataExame: '2024-01-15',
        idempotencyKey: 'concurrent-key-001',
      };

      const promises = Array(5)
        .fill(null)
        .map(() =>
          request(app.getHttpServer()).post('/exames').send(createDto),
        );

      const responses = await Promise.all(promises);

      responses.forEach((response) => {
        expect([200, 201]).toContain(response.status);
      });

      const listResponse = await request(app.getHttpServer())
        .get('/exames')
        .expect(200);

      const examesWithKey = listResponse.body.data.filter(
        (e: { idempotencyKey: string }) =>
          e.idempotencyKey === createDto.idempotencyKey,
      );
      expect(examesWithKey).toHaveLength(1);
    });
  });

  describe('GET /exames', () => {
    it('should return paginated list of exames', async () => {
      for (let i = 1; i <= 3; i++) {
        await request(app.getHttpServer())
          .post('/exames')
          .send({
            pacienteId,
            modalidade: Modalidade.CT,
            dataExame: `2024-01-${String(i).padStart(2, '0')}`,
            idempotencyKey: `list-key-${i}`,
          });
      }

      const response = await request(app.getHttpServer())
        .get('/exames')
        .query({ page: 1, pageSize: 10 })
        .expect(200);

      expect(response.body.data).toHaveLength(3);
      expect(response.body.total).toBe(3);
      expect(response.body.page).toBe(1);
      expect(response.body.pageSize).toBe(10);
      expect(response.body.totalPages).toBe(1);
    });

    it('should return correct pagination when pageSize is smaller than total', async () => {
      for (let i = 1; i <= 5; i++) {
        await request(app.getHttpServer())
          .post('/exames')
          .send({
            pacienteId,
            modalidade: Modalidade.MR,
            dataExame: `2024-01-${String(i).padStart(2, '0')}`,
            idempotencyKey: `pagination-key-${i}`,
          });
      }

      const response = await request(app.getHttpServer())
        .get('/exames')
        .query({ page: 1, pageSize: 2 })
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.total).toBe(5);
      expect(response.body.totalPages).toBe(3);
    });

    it('should return empty list when no exames exist', async () => {
      await dataSource.query('DELETE FROM exames');

      const response = await request(app.getHttpServer())
        .get('/exames')
        .query({ page: 1, pageSize: 10 })
        .expect(200);

      expect(response.body.data).toHaveLength(0);
      expect(response.body.total).toBe(0);
    });

    it('should use default pagination values when not provided', async () => {
      const response = await request(app.getHttpServer())
        .get('/exames')
        .expect(200);

      expect(response.body.page).toBe(1);
      expect(response.body.pageSize).toBe(10);
    });
  });
});

